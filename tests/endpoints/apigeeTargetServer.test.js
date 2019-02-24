//  add environment variables
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const {
  getTargetServerNames,
  getTargetServer,
  newTargetServer,
  removeTargetServer,
  testTargetServerExists
} = require('../../src/endpoints/apigeeTargetServer');


/*
test('getTargetServerNames', async () => {
  var result = await getTargetServerNames('dev');
  expect(result.length).toBeGreaterThanOrEqual(1);
});

test('getTargetServer_full_environment', async () => {
  var result = await getTargetServer('dev');

  expect(result.length).toBe(1);
  expect(result[0].host).toBe('registrar.test.sa.ucsb.edu');
  expect(result[0].isEnabled).toBe(true);
});

test('getTargetServer_individual_name', async () => {
  var result = await getTargetServer('dev','sa-registrar');

  expect(result.length).toBe(1);
  expect(result[0].host).toBe('registrar.test.sa.ucsb.edu');
  expect(result[0].isEnabled).toBe(true);
});

test('newTargetServer | testTargetServerExists | removeTargetServer', async () => {

  if(await testTargetServerExists('dev','sa-deleteme')) {
    await removeTargetServer('dev','sa-deleteme');
  }

  var result = await newTargetServer('dev','sa-deleteme','registrar.test.sa.ucsb.edu');

  expect(result.host).toBe('registrar.test.sa.ucsb.edu');
  expect(result.port).toBe(443);
  expect(result.sSLInfo.protocols[0]).toBe("TLSv1.2");

  
  var exists = await testTargetServerExists('dev','sa-deleteme')
  expect(exists).toBe(true)


  var result = await removeTargetServer('dev','sa-deleteme');

  expect(result.host).toBe('registrar.test.sa.ucsb.edu');
  expect(result.port).toBe(443);
  expect(result.sSLInfo.protocols[0]).toBe("TLSv1.2");
  
});
*/