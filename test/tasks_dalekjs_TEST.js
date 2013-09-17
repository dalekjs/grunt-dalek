'use strict';

var expect = require('chai').expect;
var GruntTask = require('../tasks/dalekjs');

describe('grunt-dalek', function() {

  it('should be okay', function(){
    expect(GruntTask).to.be.ok;
  });

});
