module.exports = function (sequelize, Datatypes) {

  return sequelize.define('comment', {
    id: { type: Datatypes.INTEGER, autoIncrement: true, primaryKey: true },
    uniqueId: { type: Datatypes.STRING, allowNull: false, field: 'unique_id' },
    content: { type: Datatypes.STRING, allowNull: false },
    iconId: { type: Datatypes.INTEGER, defaultValue: 0 , field: 'icon_id' },
    nickname: Datatypes.STRING
  }, {
    updatedAt: false
  });

};
