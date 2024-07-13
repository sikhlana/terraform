# CDK for Terraform on Steroids(!!)
### Typescript Template

---

This is highly opinionated CDKTF template for Typescript that I developed to ease my IaaC development
and have been using this is production environment for some time now without any hitch.

**If you want to see a real-life example of how this template works,
visit [this repo](https://github.com/sikhlana/terraform).**


## Features

- Use any supported backend (default is `local`).
- Automatically autoload all stacks and its constructs (resources and data).
- A minimal dependency injector using [tsyringe](https://github.com/microsoft/tsyringe).
- Define Terraform Cloud workspace using the `@Workspace(workspace: string, project?: string)` decorator.
- View all your definitions in a tree format by running `ts-node main.ts`.

## Requirements
- Terraform: `>=1.5`
- CDKTF: `>=0.17`
- NodeJS: `>=18.0`
- Typescript: `>=5.1`


## Usage

1. Create a template from this repo.
2. Update the value for `projectId` inside the `cdktf.json` file.
   You can generate a random UUID [from here](https://www.uuidgenerator.net/version4).
3. Install NPM dependencies by running `npm ci --include=dev`.
4. Install your required providers by running `cdktf provider add <provider...>`.
5. Create your stacks.
6. Run `cdktf apply '*'`.
7. ???
8. Profit.


## Tests

You can follow [these instructions](https://developer.hashicorp.com/terraform/cdktf/test/unit-tests) to set up unit tests.


## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Credits

- [Saif Mahmud](https://github.com/sikhlana)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
