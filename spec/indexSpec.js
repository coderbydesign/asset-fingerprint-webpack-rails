describe("AssetFingerprint", function() {
  var AssetFingerprint = require('../index');
  var fs = require('fs');
  var fingerprint;

  describe("initialization", function() {
      describe("needsFingerprint", function() {

      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(false);
        spyOn(fs, "readFileSync").and.returnValue("");
      });

      it("should default needsFingerprint = true when no args", function() {
        fingerprint = new AssetFingerprint('');
        expect(fingerprint.needsFingerprint).toBeTruthy();
      });

      it("should accept true", function() {
        fingerprint = new AssetFingerprint('', true);
        expect(fingerprint.needsFingerprint).toBeTruthy();
      });

      it("should accept false", function() {
        fingerprint = new AssetFingerprint('', false);
        expect(fingerprint.needsFingerprint).toBeFalsy();
      });

      it("should accept null", function() {
        fingerprint = new AssetFingerprint('', null);
        expect(fingerprint.needsFingerprint).toBeFalsy();
      });
    });

    describe("initializer path", function() {
      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(false);
        spyOn(fs, "readFileSync").and.returnValue("");
      });

      it("should set when supplied", function() {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir, true);
        expect(fingerprint.initializerDirectory).toEqual(dir);
      });

      it("should fail when not supplied", function() {
        fingerprint = function() { new AssetFingerprint(); }
        expect(fingerprint).toThrowError('Please supply a directory path for your initializer, such as `config/initializers`.');
      });
    });

    describe("fingerprint name", function() {
      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(false);
        spyOn(fs, "readFileSync").and.returnValue("");
      });

      it("should use ASSET_FINGERPRINT when no args are passed", function () {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir);
        expect(fingerprint.fingerprintName).toEqual("ASSET_FINGERPRINT");
      });

      it("should use value when provided", function () {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir, true, "TEST_FINGERPRINT");
        expect(fingerprint.fingerprintName).toEqual("TEST_FINGERPRINT");
      });
    });

    describe("fingerprint name", function() {
      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(true);
        spyOn(fs, "readFileSync").and.returnValue("TEST_FINGERPRINT");
      });

      it("should validate for duplicate name.", function () {
        var dir = 'config/initializers';
        fingerprint = function() { new AssetFingerprint(dir, true, "TEST_FINGERPRINT"); }
        expect(fingerprint).toThrowError('The provided fingerprint name has already been used.');
      });

      it("should validate the file name characters.", function() {
        var dir = 'config/initializers';
        fingerprint = function() { new AssetFingerprint(dir, true, "asset_FINGERPRINT"); }
        expect(fingerprint).toThrowError('Please supply a fingerprint name that is all caps separating words by underscores (i.e. CUSTOM_ASSET_FINGERPRINT).');
      });

      it("should validate the file name format.", function() {
        var dir = 'config/initializers';
        fingerprint = function() { new AssetFingerprint(dir, true, "BAD_VALUE"); }
        expect(fingerprint).toThrowError('Please supply a fingerprint name that is all caps separating words by underscores (i.e. CUSTOM_ASSET_FINGERPRINT).');
      });
    });

    describe("fingerprint name", function() {
      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(true);
        spyOn(fs, "readFileSync").and.returnValue("ASSET_FINGERPRINT");
      });

      it("should not validate for duplicate name with default arguments.", function () {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir);
        expect(fingerprint.fingerprintName).toEqual("ASSET_FINGERPRINT");
      });
    });

    describe("fingerprint name", function() {
      beforeEach(function() {
        spyOn(fs, "existsSync").and.returnValue(false);
        spyOn(fs, "readFileSync").and.returnValue("");
      });

      it("should not validate when file does not exist.", function () {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir, true, "TEST_FINGERPRINT");
        expect(fingerprint.fingerprintName).toEqual("TEST_FINGERPRINT");
      });
    });

    describe("apply", function() {
      beforeEach(function() {
        spyOn(fs, "writeFileSync");
        spyOn(fs, "appendFileSync");
        spyOn(fs, "existsSync").and.returnValue(false);
        spyOn(fs, "readFileSync").and.returnValue("");
        spyOn(console, "log");
      });

      it("should call writeFileSync on default arguments", function() {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir);
        fingerprint.apply({
          plugin: function(status, callback) { callback({hash: "A1B2C3D4"}) }
        });

        expect(fs.writeFileSync).toHaveBeenCalledWith(
          'config/initializers/asset_fingerprint.rb', "ASSET_FINGERPRINT = 'A1B2C3D4'");

        expect(console.log).toHaveBeenCalledWith(
          "asset-fingerprint-webpack-rails: updated file config/initializers/asset_fingerprint.rb with ASSET_FINGERPRINT = A1B2C3D4");
      });

      it("should call appendFileSync on provided fingerprint name argument", function() {
        var dir = 'config/initializers';
        fingerprint = new AssetFingerprint(dir, true, "TEST_FINGERPRINT");
        fingerprint.apply({
          plugin: function(status, callback) { callback({hash: "Z1Y2X3W4"}) }
        });

        expect(fs.appendFileSync).toHaveBeenCalledWith(
          'config/initializers/asset_fingerprint.rb', "\r\nTEST_FINGERPRINT = 'Z1Y2X3W4'");

        expect(console.log).toHaveBeenCalledWith(
          "asset-fingerprint-webpack-rails: updated file config/initializers/asset_fingerprint.rb with TEST_FINGERPRINT = Z1Y2X3W4");
      });
    });
  });
});
