/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { ensureLoggedIn } = require('../../auth');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [, , ctx] = args;
      ensureLoggedIn(ctx);
      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
