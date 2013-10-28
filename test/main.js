var jshint = require('../');
var should = require('should');
require('mocha');

describe('gulp-jshint', function() {
  describe('jshint()', function() {
    it('file should pass through', function(done) {
      var a = 0;

      var fakeFile = {
        path: "./test/fixture/file.js",
        shortened: "file.js",
        contents: new Buffer("wadup();")
      };

      var stream = jshint();
      stream.on('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.shortened);
        should.exist(newFile.contents);
        newFile.path.should.equal("./test/fixture/file.js");
        newFile.shortened.should.equal("file.js");
        ++a;
      });

      stream.once('end', function () {
        a.should.equal(1);
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });
    it('should jshint two files', function(done) {
      var a = 0;

      var fakeFile = {
        path: "./test/fixture/file.js",
        shortened: "file.js",
        contents: new Buffer("wadup();")
      };

      var fakeFile2 = {
        path: "./test/fixture/file2.js",
        shortened: "file2.js",
        contents: new Buffer("wadup();")
      };

      var stream = jshint();
      stream.on('data', function(newFile){
        ++a;
      });

      stream.once('end', function () {
        a.should.equal(2);
        done();
      });

      stream.write(fakeFile);
      stream.write(fakeFile2);
      stream.end();
    });
    it('should send success status', function(done) {
      var a = 0;

      var fakeFile = {
        path: "./test/fixture/file.js",
        shortened: "file.js",
        contents: new Buffer("wadup();")
      };

      var stream = jshint();
      stream.on('data', function (newFile) {
        ++a;
        should.exist(newFile.jshintSuccess);
        newFile.jshintSuccess.should.equal(true);
        should.exist(newFile.jshintErrors);
        newFile.jshintErrors.should.equal(0);
        should.not.exist(newFile.jshintResults);
      });
      stream.once('end', function () {
        a.should.equal(1);
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });
    it('should send failure status', function(done) {
      var a = 0;

      var fakeFile = {
        path: "./test/fixture/file.js",
        shortened: "file.js",
        contents: new Buffer("doe =")
      };

      var stream = jshint();
      stream.on('data', function (newFile) {
        ++a;
        should.exist(newFile.jshintSuccess);
        newFile.jshintSuccess.should.equal(false);
        should.exist(newFile.jshintErrors);
        newFile.jshintErrors.should.equal(3); // FRAGILE: This document could get worse with time
        should.exist(newFile.jshintResults);
      });
      stream.once('end', function () {
        a.should.equal(1);
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });
  });
});
