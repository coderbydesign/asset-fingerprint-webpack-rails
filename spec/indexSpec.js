describe("AssetFingerprint", function() {
  var AssetFingerprint = require('../index');
  var fingerprint;

  describe("initialization", function() {
      describe("needsFingerprint", function() {
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
  });
});
