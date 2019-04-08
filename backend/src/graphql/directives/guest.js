/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { ensureLoggedOut } = require('../../auth');

class GuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [, , ctx] = args;
      ensureLoggedOut(ctx);
      return resolve.apply(this, args);
    };
  }
}

module.exports = GuestDirective;
