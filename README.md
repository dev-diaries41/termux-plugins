# termux-plugins

This repository contains a collection of Termux-Plugins, which can be added as Termux-Services (background running processes). Each plugin follows a standardized format to ensure easy integration with Termux-Services. Plugins can be managed using the `tplug` CLI tool. For instructions on how to install and use `tplug`, visit the [tplug repository](https://github.com/dev-diaries41/termux-plugin-cli.git).

## Plugin Structure

Each plugin in this repository follows the directory structure below:

```
my_plugin/
  ├── run               # Executable bash script for starting the service
  ├── plugin/           # Optional additional scripts (Python, Bash, etc.) for the service
  ├── plugin.yml        # YAML file listing Termux dependencies and configuration
```

### Explanation of Files

- **run**: The main executable bash script required to start the service. It will be executed when starting the Termux service using `sv-enable <service_name>`.

- **plugin/**: A directory that contains any additional scripts (Bash, Python, etc.) needed by the service. This is optional and only necessary if the service has dependencies beyond the `run` script.

- **plugin.yml**: A YAML file that lists the Termux dependencies and configuration settings required for the service. It also includes metadata about the plugin, such as its name, description, and required packages.

### Example `plugin.yml`

Here is an example of a `plugin.yml` file for a plugin:

```yaml
dependencies:
  - name: watchexec       # For triggering actions on file changes

```