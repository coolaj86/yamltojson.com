use JSON;
use YAML::XS;

my $yaml = <<'...';
---
foo: bar
...

print encode_json Load $yaml;
