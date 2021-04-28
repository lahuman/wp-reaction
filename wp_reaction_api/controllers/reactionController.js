'use strict'

var service = require('./reactionService');

module.exports.getPostInfo = function getPostInfo(req, res, next) {
  service.getPostInfo(req.swagger.params, res, next);
};
module.exports.postInfo2xls = function postInfo2xls(req, res, next) {
  service.postInfo2xls(req.swagger.params, res, next);
};

module.exports.getPostCommentInfo = function getPostCommentInfo(req, res, next) {
  service.getPostCommentInfo(req.swagger.params, res, next);
};

module.exports.postCommentInfo2xls = function postCommentInfo2xls(req, res, next) {
  service.postCommentInfo2xls(req.swagger.params, res, next);
};

module.exports.getUserPictures = function getUserPictures(req, res, next) {
  service.getUserPictures(req.swagger.params, res, next);
};

module.exports.postRead2xls = function postRead2xls(req, res, next) {
  service.postRead2xls(req.swagger.params, res, next);
};
