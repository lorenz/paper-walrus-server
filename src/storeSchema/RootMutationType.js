'use strict';
const {GraphQLString, GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull} = require('graphql'),
  _ = require('lodash'),
  databaseHelpers = require('../databaseHelpers'),
  DocumentType = require('./DocumentType'),
  DocumentVisibilityLevel = require('./DocumentVisibilityLevel');

module.exports = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createDocument: {
      type: DocumentType,
      args: {input: {type: new GraphQLInputObjectType({
        name: 'CreateDocumentInput',
        fields: {
          name: {type: GraphQLString},
          visibility: {type: new GraphQLNonNull(DocumentVisibilityLevel)},
        },
      })}},
      resolve: (parent, {input}, context) => {
        return databaseHelpers.createDocument(context, input).returning('id')
          .then(([id]) => databaseHelpers.getDocumentById(context, id)); //TODO single query
      },
    },
    renameDocument: {
      type: DocumentType,
      args: {input: {type: new GraphQLInputObjectType({
        name: 'RenameDocumentInput',
        fields: {
          documentId: {type: new GraphQLNonNull(GraphQLString)},
          name: {type: GraphQLString},
        },
      })}},
      resolve: (parent, {input: {documentId: id, name}}, context) => {
        return context.knex('documents').where('documents.id', id).update({name: name || null})
          .then(() => databaseHelpers.getDocumentById(context, id)); //TODO single query
      },
    },
  },
});
