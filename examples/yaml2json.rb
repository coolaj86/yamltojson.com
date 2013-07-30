require 'json'
require 'yaml'

yml = <<-eos
---
  foo: bar
eos

data = YAML::load(yml)
json = JSON.dump(data)

puts json
