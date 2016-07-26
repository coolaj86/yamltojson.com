extern crate serde_json as json;
extern crate serde_yaml as yaml;

fn main() {
    let yaml_string = "---\nfoo: bar";

    let json: json::Value = yaml::from_str(yaml_string).expect("Could not convert");

    println!("{}", json);
}
