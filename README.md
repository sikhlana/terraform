# CDK for Terraform on Steroids(!!)
### Typescript Template

---

This is highly opinionated CDKTF template for Typescript that I use for myself to
ease my IaaC development and have been using this in production environments without any hitch.

**If you want to see a real-life example of how this template works,
visit [this repo](https://github.com/sikhlana/terraform).**


## Features

- Control your Terraform Cloud / Enterprise resources within this codebase.
- Autoload all the stacks and its resources and data instead of manually importing them from somewhere. 
- A minimal dependency injector:
  - Refer to stacks using the `@Stack()` decorator (usable within a `TerraformStack` class).
  - Refer to resources within the stack with the `@Resource(id: string)` decorator.
  - Refer to data within the stack with the `@Data(id: string)` decorator.
- Define resource or datum metadata from a different method instead of the `constructor(...)` with the `@Constructor()` decorator.
- Define Terraform Cloud workspace with the `@Workspace(name: string, config?: WorkspaceConfig)` decorator.


## Requirements
- Terraform: `>=1.5`
- CDKTF: `>=0.17`
- NodeJS: `>=18.0`
- Typescript: `>=5.1`


## Usage

1. Create a template from this repo.
2. Update the value for `projectId` inside the `cdktf.json` file. You can generate a random UUID [from here](https://www.uuidgenerator.net/version4).
3. Install your required providers by running `cdktf provider add <provider...>`.
4. Create your stacks.
5. Run `cdktf apply '*' --auto-approve`.
6. ???
7. Profit.


## Tests

_Tests are for pussies. Directly raw-dog your infrastructure like a boss!_

__On a serious note,__ I didn't get the time to create tests for this project.<br>
__*Hopefully in the near future?*__


## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Credits

- [Saif Mahmud](https://github.com/sikhlana)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
