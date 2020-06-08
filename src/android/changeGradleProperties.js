var fs = require('fs');

module.exports = function (context) {

  /**
   * Changes the target gradlePropertiesFile adding or changing existing properties with key
   * @param propertyAndValArray - An array with items in the format `key=value`
   * @param gradlePropertiesFile - location of the gradle.properties file
   */
  function setGradleProperties(propertyAndValArray, gradlePropertiesFile) {
	let fileContents = fs.readFileSync(gradlePropertiesFile, 'utf-8');

	propertyAndValArray.forEach( function (propertyAndVal) {

	  console.log(`Parsing ${propertyAndVal} ...`);
	  let propertyName = propertyAndVal.split("=")[0];
	  let propertyVal = propertyAndVal.split("=")[1];
	  let containsProperty = fileContents.match(propertyName);
	  if (containsProperty) {
		console.log(`Property ${propertyName} exists, setting value to false`);
		fileContents = fileContents.replace(`${propertyName}=.+`, `${propertyName}=${propertyVal}`)
	  } else {
		console.log(`Adding property ${propertyName} with value ${propertyVal}`);
		fileContents += `\n${propertyName}=${propertyVal}`
	  }
	  fs.writeFileSync(gradlePropertiesFile, fileContents, 'utf-8');
	});
  }

  return new Promise(function (resolve, reject) {

	let projectRoot = context.opts.projectRoot;

	const gradlePropertiesFile = projectRoot + '/platforms/android/gradle.properties'

	console.log("Handling gradle.properties file")
	let fileExists = fs.existsSync(gradlePropertiesFile);
	if (fileExists) {
	  setGradleProperties([
		  "android.useAndroidX=true",
		  "android.enableJetifier=true"
		]
		, gradlePropertiesFile);
	  return resolve();
	} else {
	  console.log("gradle.properties file not found")
	  return reject
	}
  });
};