// read.js
const fs = require('fs');
const yaml = require('js-yaml');

// Get document, or throw exception on error
try {
    const doc = yaml.load(fs.readFileSync('./.circleci/config.yml', 'utf8'));
    console.log(JSON.stringify(doc, null, 2));
    // console.log(doc);
  } catch (e) {
    console.log(e);
  }

/**
{
  version: 2.1,
  orbs: { welcome: 'circleci/welcome-orb@0.4.1' },
  jobs: {
    save_hello_world_output: { docker: [Array], steps: [Array], persist_to_workspace: [Object] },
    print_output_file: { docker: [Array], steps: [Array], attach_workspace: [Object] },
    print_hello: { docker: [Array], steps: [Array] },
    print_world: { docker: [Array], steps: [Array] },
    show_env_var: { docker: [Array], steps: [Array] }
  },
  workflows: {
    save_hello_world_output: { jobs: [Array] },
    test_env_var: { jobs: [Array] }
  }
}
 */