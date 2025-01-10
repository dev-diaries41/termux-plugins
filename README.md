# Termux-Plugins  
This repository contains a collection of **Plugins** for Termux, which can be categorized into two types:  

1. **Plugin-Services**: Custom background services that can be managed via Termux's service management system.  
2. **Plugin-Scripts**: User-defined executable scripts that can be run directly from the local directory.  

Plugins can be managed using the `tplug` CLI tool. For instructions on how to install and use `tplug`, visit the [tplug repository](https://github.com/dev-diaries41/termux-plugin-cli.git).  

> **Note:** To use Plugin-Services, ensure that **termux-services** is installed in your Termux environment. This dependency is not included in the `plugin.txt` files for Plugin-Services, as it is assumed to already be installed by users who need service-related functionality.  

---

## Table of Contents  

- [Plugin Structure](#plugin-structure)  
  - [Explanation of Files](#explanation-of-files)  
  - [Example `plugin.txt`](#example-plugintxt)  
- [Installing Plugins](#installing-plugins)  
- [Scripts](#scripts)  
- [Services](#services)  

---

## Plugin Structure  

Each plugin in this repository follows a standardized directory structure, regardless of whether it is a **Plugin-Service** or **Plugin-Script**.  

```
my_plugin/  
  ├── run               # Executable bash script for starting the service or running the script  
  ├── plugin/           # Optional additional files (Bash, Python, JS etc.) for the service.  
  ├── plugin.txt        # Txt file listing Termux dependencies on separate lines  
```  

### Explanation of Files  

- **run**:  
  The main executable bash script required to start the service or run the script. For **Plugin-Services**, this is the script that starts the background process. For **Plugin-Scripts**, this is the script executed when the user runs the plugin.  

- **plugin/**:  
  A directory that contains any additional scripts (Bash, Python, etc.) needed by the service or script. This is optional and only necessary if the plugin requires extra dependencies beyond the `run` script.  

- **plugin.txt**:  
  A text file that lists the Termux dependencies required for the plugin. This is important to ensure that all necessary dependencies are installed before the plugin runs. Can be omitted if none are required.  

### Example `plugin.txt`  

Here is an example of a `plugin.txt` file for a plugin:  

```
termux-api  
nodejs-lts  
```  

---

## Installing Plugins  

Plugins can be installed using the `tplug` CLI tool. The following commands are available for installing plugins:  

1. **`install [<name> | -a] [-s | -r]`**  
   Install plugin-services or plugin-scripts from the repository.  
   - `<name>`: Install a specific plugin-service or plugin-script.  
   - `-a`: Install all plugins (requires `-s` or `-r`).  
   - `-s`: Install plugin-services.  
   - `-r`: Install plugin-scripts.  

2. For Plugin-Services, once installed, you must create a Termux service using:  
   **`add <plugin_name>`**  
   Add a plugin-service from a local directory to the Termux service manager.  

   ```bash  
   tplug add <plugin_name>  
   ```  

---

## Services  

This section lists all available **Plugin-Services** in the repository. Each service can be managed via Termux's service management system, which allows you to start, stop, and monitor background processes.  

### **Telemux**  
A lightweight Termux-based Telegram client that uses `termux-notifications`, `termux-dialog`, and a simple Express server to handle messages.  

#### **Requirements**  
- **Termux:API app** must be installed to enable essential functionalities like notifications and dialogs.  
- **Telegram Bot Token** is required to get Telegram messages. You can get this from the `Bot Father` bot in Telegram. Once you have this, add it to `plugin/run.js`.  

---

## Scripts  

This section lists all available **Plugin-Scripts** in the repository.  