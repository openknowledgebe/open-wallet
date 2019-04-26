/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
const { SchemaDirectiveVisitor, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType, GraphQLNonNull, GraphQLString } = require('graphql');
const {
  checkEmail,
  lengthIsGreaterOrEqual,
  lengthIsLowerOrEqual
} = require('../../lib/validation');
const { WRONG_EMAIL_FORMAT, TOO_SHORT, TOO_LONG, REQUIRED } = require('../../messages');

// inspired by https://github.com/confuser/graphql-constraint-directive

const validate = (fieldName, value, args) => {
  if (args.format && args.format === 'email') {
    if (!checkEmail(value)) {
      throw new UserInputError(WRONG_EMAIL_FORMAT);
    }
  }

  if (args.required && !value) {
    throw new UserInputError(REQUIRED(fieldName));
  }

  if (!lengthIsLowerOrEqual(value, args.maxLength)) {
    throw new UserInputError(TOO_LONG(fieldName, args.maxLength));
  }

  if (args.minLength && !lengthIsGreaterOrEqual(value, args.minLength)) {
    throw new UserInputError(TOO_SHORT(fieldName, args.minLength));
  }
};

class ConstraintStringType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `ConstraintString`,

      serialize(value) {
        return type.serialize(value);
      },

      parseValue(value) {
        const val = type.parseValue(value).trim();
        validate(fieldName, val, args);
        return val;
      },

      parseLiteral(ast) {
        const val = type.parseLiteral(ast).trim();
        validate(fieldName, val, args);
        return val;
      }
    });
  }
}

// https://www.apollographql.com/docs/graphql-tools/schema-directives#enforcing-value-restrictions
class ConstraintDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  visitArgumentDefinition(argument) {
    this.wrapType(argument);
  }

  wrapType(field) {
    if (field.type instanceof GraphQLNonNull && field.type.ofType === GraphQLString) {
      field.type = new GraphQLNonNull(
        new ConstraintStringType(field.name, field.type.ofType, this.args)
      );
    } else if (field.type instanceof GraphQLString) {
      field.type = new ConstraintStringType(field.name, field.type, this.args);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

module.exports = ConstraintDirective;
