describe("AssetFingerprint", function() {
  var AssetFingerprint = require('../index');
  var fingerprint;

  describe("initialization", function() {
    it("should default needsFingerprint = true when no args", function() {
      fingerprint = new AssetFingerprint();
      expect(fingerprint.needsFingerprint).toBeTruthy();
    });

    it("should accept true", function() {
      fingerprint = new AssetFingerprint(true);
      expect(fingerprint.needsFingerprint).toBeTruthy();
    });

    it("should accept false", function() {
      fingerprint = new AssetFingerprint(false);
      expect(fingerprint.needsFingerprint).toBeFalsy();
    });

    it("should accept null", function() {
      fingerprint = new AssetFingerprint(null);
      expect(fingerprint.needsFingerprint).toBeFalsy();
    });
  });
});
