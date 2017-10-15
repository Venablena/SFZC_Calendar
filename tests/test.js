const chai = require('chai')
const expect = chai.expect
const main = require('../js/main.js')

describe('leapYear', function(){
  it('is a function', function(){
    expect(main.leapYear).to.be.a('function')
  })
  it('should return a leap year', function(){
    expect.(main.leapYear(2008).to.equal('true'))
  })
})
