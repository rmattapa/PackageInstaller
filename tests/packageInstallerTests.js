describe('Package Installer', function() {

  it('is an object', function() {
    expect(typeof PackageInstaller).toBe('function');
  });

  it('accepts an array of strings', function() {
		var packages = ['a:b','c:d'];
		var installer = new PackageInstaller(['a:b','c:d']);
	    expect(installer.packages).toEqual(packages);
  });

  it('returns a string', function() {
    expect(new PackageInstaller(['a:b','c:d']).install()).toEqual(jasmine.any(String));
  });

  describe('fails when', function() {		
    it('given a string', function() {
      expect(function() { new PackageInstaller('a'); }).toThrow();
    });

    it('given a number', function() {
      expect(function() { new PackageInstaller(1); }).toThrow();
    });

    it('given an object', function() {
      expect(function() { new PackageInstaller({ a:'b' }); }).toThrow();
    });

    it('array contains numbers', function() {
      expect(function() { new PackageInstaller([1,2]); }).toThrow();
    });

    it('array contains object', function() {
      expect(function() { new PackageInstaller([{a:'b'},{a:'b'}]); }).toThrow();
    });
  });

  describe('should error', function() {
    it('because of a cicular reference', function () {
      expect(function () {
        var packageInstaller = PackageInstaller(['a:b', 'b:a']);
				packageInstaller.install();
      }).toThrow('cicular reference');
    });
  });

  describe('will work', function() {
    it('with a single valid package', function() {
      var input = ['a:'];
      expect(new PackageInstaller(input).install()).toEqual('a');
    });

    it('with words with spaces', function() {
      var input = [
        'Kitten Service:Camel Caser',
        'Camel Caser:'
      ];
      expect(new PackageInstaller(input).install()).toEqual('Camel Caser, Kitten Service');
    });

    it('with symbols and quotes', function() {
      var input = [
        '!@#$%^&*()_+""{}[]:'
      ];
      expect(new PackageInstaller(input).install()).toEqual('!@#$%^&*()_+""{}[]');
    });

    it('with lots of singles', function() {
      var input = ('abcdefghijklmnopqrstuvwxyz').split('').map(function(a) { return a + ':'; });
      expect(new PackageInstaller(input).install()).toEqual(('abcdefghijklmnopqrstuvwxyz').split('').join(', '));
    });

    it('when a package has a comma (but is weird)', function() {
      var input = [
        'a,b:',
        'c:a,b'
      ];
      expect(new PackageInstaller(input).install()).toEqual('a,b, c');
    });

    it('when a packages are out of order', function() {
      var input = [
        'b:a',
        'c:b',
        'a:',
      ];
      expect(new PackageInstaller(input).install()).toEqual('a, b, c');
    });

    it('when a package has many dependencies', function() {
      var input = [
        'a:',
        'b:a',
        'c:a',
        'd:c',
        'e:c'
      ];
      expect(new PackageInstaller(input).install()).toEqual('a, b, c, d, e');
    });

  });

  describe('will trim words', function() {
    it('when given a package with spaces', function() {
      var input = [' a : '];
      expect(new PackageInstaller(input).install()).toEqual('a');
    });
  });

  describe('will replace duplicates', function() {
    it('when given duplicate packages', function() {
      var input = ['a:','a:', 'b:a'];
      expect(new PackageInstaller(input).install()).toEqual('a, b');
    });
  });

  describe('examples', function() {
    it('expects the first to function', function(){
      var input = [
        'KittenService:CamelCaser',
        'CamelCaser:'
      ];
      expect(new PackageInstaller(input).install()).toEqual('CamelCaser, KittenService');
    });

    it('expects the second to function', function() {
      var input = [
        'KittenService:',
        'Letmeme:Cyberportal',
        'Cyberportal:Ice',
        'CamelCaser:KittenService',
        'Fraudstream:Letmeme',
        'Ice:'
      ];
      expect(new PackageInstaller(input).install()).toEqual('KittenService, Ice, Cyberportal, Letmeme, CamelCaser, Fraudstream');
    });
  });
});