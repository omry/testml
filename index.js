// Generated by CoffeeScript 2.3.0
(function() {
  var changeView, focusTop, import_bridge, import_testml, math_bridge, math_testml, runTestML, setCompilerTest, setExample, setTestMLTest, setView, setYAMLTest, show_error, yamlImporter, yaml_bridge;

  show_error = function(error) {
    console.log(error);
    if (TestML.state.view === 'mocha') {
      error = String(error);
      error = error.replace(/\n/g, '<br>');
      error = error.replace(/\ /g, '&nbsp;');
      $('#mocha').html('<span class="error">' + error + '</span>');
    } else {
      $('#output').val(String(error));
    }
    throw error;
  };

  runTestML = function(importer) {
    var bridge, compiler, e, json, module, output, require, runner, testml;
    output = $('#output');
    output.val('');
    try {
      compiler = new TestMLCompiler.Compiler({
        importer: yamlImporter
      });
      json = compiler.compile($('#testml').val());
      testml = JSON.parse(json);
    } catch (error1) {
      e = error1;
      show_error(e);
    }
    if (TestML.state.view === 'compiler') {
      output.val(json);
      return;
    }
    try {
      require = function() {};
      module = {
        exports: {}
      };
      eval(CoffeeScript.compile($('#bridge').val(), {
        bare: true
      }));
      bridge = new TestMLBridge;
    } catch (error1) {
      e = error1;
      show_error(e);
    }
    try {
      if (TestML.state.view === 'tap') {
        runner = new TestML.Run.TAP({
          testml: testml,
          bridge: bridge,
          stdlib: new TestML.StdLib,
          output: output[0]
        });
      } else {
        runner = new TestML.Run.Mocha({
          testml: testml,
          bridge: bridge,
          stdlib: new TestML.StdLib
        });
      }
      return runner.test();
    } catch (error1) {
      e = error1;
      return show_error(e);
    }
  };

  yamlImporter = function(name) {
    var result;
    result = null;
    $.ajax({
      url: './yaml/' + name + '.tml',
      success: function(input) {
        var compiler;
        compiler = new TestMLCompiler.Compiler({
          importer: yamlImporter
        });
        return result = JSON.parse(compiler.compile(input));
      },
      async: false
    });
    return result;
  };

  setExample = function(name) {
    if (!_.isString(name)) {
      name = this.value;
    }
    TestML.state.name = name;
    TestML.state.type = 'example';
    TestML.params.set('type', 'example');
    TestML.params.set('name', name);
    window.history.replaceState('', '', `?${TestML.params.toString()}`);
    $('#yaml')[0].selectedIndex = 0;
    $('#test')[0].selectedIndex = 0;
    $('#ctest')[0].selectedIndex = 0;
    $('#testml').val(window.examples[`${name}_testml`]);
    $('#bridge').val(window.examples[`${name}_bridge`]);
    focusTop('testml');
    return runTestML();
  };

  setTestMLTest = function(name) {
    var test_bridge;
    if (!_.isString(name)) {
      name = this.value;
    }
    TestML.state.name = name;
    TestML.state.type = 'test';
    TestML.params.set('type', 'test');
    TestML.params.set('name', name);
    window.history.replaceState('', '', `?${TestML.params.toString()}`);
    $('#example')[0].selectedIndex = 0;
    $('#yaml')[0].selectedIndex = 0;
    $('#ctest')[0].selectedIndex = 0;
    test_bridge = '';
    $.ajax({
      url: './test/testml-bridge.coffee',
      success: function(text) {
        return test_bridge = text;
      },
      async: false
    });
    return $.get("test/" + name + ".tml", function(text) {
      $('#bridge').val(test_bridge);
      $('#testml').val(text);
      focusTop('testml');
      return runTestML();
    });
  };

  setCompilerTest = function(name) {
    var test_bridge;
    if (!_.isString(name)) {
      name = this.value;
    }
    TestML.state.name = name;
    TestML.state.type = 'ctest';
    TestML.params.set('type', 'ctest');
    TestML.params.set('name', name);
    window.history.replaceState('', '', `?${TestML.params.toString()}`);
    $('#example')[0].selectedIndex = 0;
    $('#yaml')[0].selectedIndex = 0;
    $('#test')[0].selectedIndex = 0;
    test_bridge = '';
    $.ajax({
      url: './ctest/testml-bridge.coffee',
      success: function(text) {
        return test_bridge = text;
      },
      async: false
    });
    return $.get("ctest/" + name + ".tml", function(text) {
      $('#bridge').val(test_bridge);
      $('#testml').val(text);
      focusTop('testml');
      return runTestML();
    });
  };

  setYAMLTest = function(name) {
    if (!_.isString(name)) {
      name = this.value;
    }
    TestML.state.name = name;
    TestML.state.type = 'yaml';
    TestML.params.set('type', 'yaml');
    TestML.params.set('name', name);
    window.history.replaceState('', '', `?${TestML.params.toString()}`);
    $('#example')[0].selectedIndex = 0;
    $('#test')[0].selectedIndex = 0;
    $('#ctest')[0].selectedIndex = 0;
    return $.get("yaml/" + name + ".tml", function(text) {
      $('#bridge').val(yaml_bridge);
      $('#testml').val(`Diff = True\n\n*in-yaml.load-yaml.to-json == *in-json\n*in-yaml.load-yaml.to-json == *in-json.load-json.to-json\n\n${text}`);
      focusTop('testml');
      return runTestML();
    });
  };

  focusTop = function(id) {
    return setTimeout(function() {
      $('#' + id).scrollTop(0);
      return $('#' + id)[0].setSelectionRange(0, 0);
    }, 200);
  };

  setView = function() {
    if (TestML.state.view === 'mocha') {
      $('#output').hide();
      return $('#mocha').show();
    } else {
      $('#mocha').hide();
      return $('#output').show();
    }
  };

  changeView = function() {
    TestML.state.view = $('input[name=view]:checked').val();
    TestML.params.set('view', TestML.state.view);
    window.history.replaceState('', '', `?${TestML.params.toString()}`);
    setView();
    return runTestML();
  };

  //------------------------------------------------------------------------------
  math_testml = '#!/usr/bin/env testml\n\n"+ - {*a} + {*a} == {*c}":\n  *a.add(*a) == *c\n\n"+ - {*c} - {*a} == {*a}":\n  *c.sub(*a) == *a\n\n"+ - {*a} * 2 == {*c}":\n  *a.mul(2) == *c\n\n"+ - {*c} / 2 == {*a}":\n  *c.div(2) == *a\n\n"+ - {*a} * {*b} == {*d}":\n  mul(*a, *b) == *d\n\n=== Test Block 1\n--- a: 3\n--- c: 6\n\n=== Test Block 2\n--- a: -5\n--- b: 7\n--- c: -10\n--- d: -35\n';

  math_bridge = 'class TestMLBridge extends TestML.Bridge\n  add: (x, y)->\n    x + y\n\n  sub: (x, y)->\n    x - y\n\n  mul: (x, y)->\n    x * y\n\n  div: (x, y)->\n    x / y';

  import_testml = 'Diff = True\n\n"YAML Load == JSON      -- +":\n  *in-yaml.load-yaml.to-json == *in-json\n\n"YAML Load == JSON Load -- +":\n*in-yaml.load-yaml.to-json == *in-json.load-json.to-json\n\n%Import 229Q 27NA 2AUY 2EBW 2LFX\n%Import 36F6 3ALJ 3GZX 3MYT 3R3P 3UYS\n%Import 4CQQ 4GC6 4Q9F 4QFQ 4UYU 4V8U 4ZYM\n%Import 52DL 54T7 57H4 5BVJ 5C5M 5GBF 5KJE 5NYZ 5WE3\n';

  import_bridge = yaml_bridge = 'class TestMLBridge extends TestML.Bridge\n  load_yaml: (yaml)->\n    yaml = yaml.replace /<SPC>/g, \' \'\n    yaml = yaml.replace /<TAB>/g, \'\\t\'\n    jsyaml.load yaml\n\n  load_json: (json)->\n    JSON.parse json\n\n  to_json: (node)->\n    JSON.stringify(node, null, 2) + \'\\n\'';

  window.examples = {
    math_testml: math_testml,
    math_bridge: math_bridge,
    import_testml: import_testml,
    import_bridge: import_bridge
  };

  //------------------------------------------------------------------------------
  $(function() {
    var state;
    state = TestML.state = {};
    TestML.params = new URLSearchParams(window.location.search.slice(1));
    state.type = TestML.params.get('type') || 'example';
    state.name = TestML.params.get('name') || 'math';
    state.view = TestML.params.get('view') || 'tap';
    TestML.params.set('type', state.type);
    TestML.params.set('name', state.name);
    TestML.params.set('view', state.view);
    setView();
    setTimeout(function() {
      $(`#${state.type}`)[0].value = state.name;
      return $("input[name=view][value=" + state.view + "]").prop('checked', true);
    }, 50);
    if (state.type === 'example') {
      setExample(state.name);
    } else if (state.type === 'test') {
      setTestMLTest(state.name);
    } else if (state.type === 'ctest') {
      setCompilerTest(state.name);
    } else if (state.type === 'yaml') {
      setYAMLTest(state.name);
    }
    $('#example').change(setExample);
    $('#test').change(setTestMLTest);
    $('#ctest').change(setCompilerTest);
    $('#yaml').change(setYAMLTest);
    $('input[name=view]').change(changeView);
    $('#testml').on('keyup', _.debounce(runTestML, 333));
    $('#bridge').on('keyup', _.debounce(runTestML, 333));
    $.get("./test/list", function(text) {
      var i, len, name, results, select, testml_tests;
      testml_tests = _.split(text, '\n');
      testml_tests.pop();
      select = $('#test');
      results = [];
      for (i = 0, len = testml_tests.length; i < len; i++) {
        name = testml_tests[i];
        results.push($('<option />', {
          value: name,
          text: name
        }).appendTo(select));
      }
      return results;
    });
    $.get("./ctest/list", function(text) {
      var i, len, name, results, select, testml_tests;
      testml_tests = _.split(text, '\n');
      testml_tests.pop();
      select = $('#ctest');
      results = [];
      for (i = 0, len = testml_tests.length; i < len; i++) {
        name = testml_tests[i];
        results.push($('<option />', {
          value: name,
          text: name
        }).appendTo(select));
      }
      return results;
    });
    return $.get("./yaml/list", function(text) {
      var i, len, name, results, select, yaml_tests;
      yaml_tests = _.split(text, '\n');
      yaml_tests.pop();
      select = $('#yaml');
      results = [];
      for (i = 0, len = yaml_tests.length; i < len; i++) {
        name = yaml_tests[i];
        results.push($('<option />', {
          value: name,
          text: name
        }).appendTo(select));
      }
      return results;
    });
  });

  // vim: ft=coffee sw=2:

}).call(this);
