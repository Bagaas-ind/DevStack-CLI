import test from 'node:test'
import assert from 'node:assert/strict'
import { getSpringBootRunCommand } from '../lib/installer.js'

test('Spring Boot next step uses the Windows Maven wrapper on Windows', () => {
  assert.equal(getSpringBootRunCommand('win32'), 'mvnw.cmd spring-boot:run')
})

test('Spring Boot next step uses the Unix Maven wrapper on POSIX systems', () => {
  assert.equal(getSpringBootRunCommand('linux'), './mvnw spring-boot:run')
  assert.equal(getSpringBootRunCommand('darwin'), './mvnw spring-boot:run')
})
