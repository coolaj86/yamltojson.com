import yaml
import json

yml = """
---
  foo: bar
"""
data = yaml.load(yml)
json = json.dumps(data)

print(json)
