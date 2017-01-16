var PackageInstaller = function (packages) {
  'use strict'

	if (packages === null)
		throw 'packages is required';
	if (!Array.isArray(packages))
		throw 'expected array of packages';
	packages.forEach(function(value) {
		if (typeof value !== 'string')
			throw 'expected items in array to be of type string';
	});

	var _packages = packages;	
	
  /**
   * parse packages array into object array
   * @param packages array
   * @returns [{ Package:'', Dependency:'' }]
   */
  var parsePackages = function() {
    var results = {};
    _packages.forEach(function(value) {
      var values = value.split(':');
      if (values.length !== 2) {
        throw 'unexpected input in string: ' + value + ' (expected x:y)';
      }

      var pkg = values[0].trim(),
        dependency = values[1].trim();

      if (pkg.length === 0) {
        throw 'invalid package length: ' + value + ' (expected x:y)';
      }

      if (!results[pkg]) results[pkg] = [];
      if (!results[dependency] && dependency.length > 0) results[dependency] = [];
      if (dependency.length > 0)
        results[pkg].push(dependency);
    });
    return results;
  }

  /**
   *
   * @param parsed packages
   * @returns sorted array
   */
  var topSort = function(parsedPackages) {
    var results = [];
    var sorted = {};

    Object.keys(parsedPackages).forEach(function(p) {
      sort(p, []);
    });

    function sort(p, ancestors) {
      if (sorted[p])
        return;
      ancestors.push(p);
      var pkg = parsedPackages[p];
      pkg.forEach(function(dependency) {
        if (ancestors.indexOf(dependency) >= 0) {
          throw 'cicular reference';
        }
        sort(dependency, ancestors);
      });
      sorted[p] = true;
      results.push(p);
    }

    return results;
  }

	return {
		packages: _packages,
		install: function() {
			var parsedPackages = parsePackages();
			return topSort(parsedPackages).join(', ');
		}
	};
};
