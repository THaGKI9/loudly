module.exports = function (sequelize, Datatypes) {

  return sequelize.define('entity', {
    id: { type: Datatypes.STRING, primaryKey: true },
    ban: Datatypes.BOOLEAN
  }, {
    classMethods: {
      canComment: function (uniqueId) {
        return this.findById(uniqueId).then((entity) => {
          let canNotComment = entity && (entity.ban === true);
          return sequelize.Promise.resolve(!canNotComment);
        });
      }
    },
    timestamps: false
  });

};
