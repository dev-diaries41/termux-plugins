# Termux-Plugins

This repository contains a collection of **Plugins** for Termux, which can be categorized into two types:

1. **Plugin-Services**: Custom background services that can be managed via Termux's service management system.
2. **Plugin-Scripts**: User-defined executable scripts that can be run directly from the local directory.

Plugins are managed using the `tplug` CLI tool. For instructions on how to install and use `tplug`, visit the [tplug repository](https://github.com/dev-diaries41/termux-plugin-cli.git).

---

## Plugin Structure

Each plugin in this repository follows a standardized directory structure, regardless of whether it is a **Plugin-Service** or **Plugin-Script**.

```
my_plugin/
  ├── run               # Executable bash script for starting the service or running the script
  ├── plugin/           # Optional additional scripts (Bash, Python, etc.) for the service
  ├── plugin.txt        # Txt file listing Termux dependencies
```

### Explanation of Files

- **run**:  
  The main executable bash script required to start the service or run the script. For **Plugin-Services**, this is the script that starts the background process. For **Plugin-Scripts**, this is the script executed when the user runs the plugin.

- **plugin/**:  
  A directory that contains any additional scripts (Bash, Python, etc.) needed by the service or script. This is optional and only necessary if the plugin requires extra dependencies beyond the `run` script.

- **plugin.txt**:  
  A text file that lists the Termux dependencies required for the plugin. This is important to ensure that all necessary dependencies are installed before the plugin runs.

### Example `plugin.txt`

Here is an example of a `plugin.txt` file for a plugin:

```
watchexec
```

This `plugin.txt` file indicates that the plugin depends on `watchexec` being installed in Termux.

---