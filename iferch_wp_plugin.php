<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.iferch.com
 * @since             1.0.0
 * @package           iFerch_Plugin
 *
 * @wordpress-plugin
 * Plugin Name:       iFerch
 * Plugin URI:        https://www.iferch.com/business
 * Description:       Get all your deliveries done with iFerch
 * Version:           1.0.0
 * Author:            iFerch
 * Author URI:        https://www.iferch.com/business
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       iferch-wp-plugin
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://www.iferch.com
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'iFERCH_PLUGIN_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function iferch_activate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-iferch_wp_plugin-activator.php';
	iFerch_Plugin_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function iferch_deactivate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-iferch_wp_plugin-deactivator.php';
	iFerch_Plugin_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'iferch_activate_plugin_name' );
register_deactivation_hook( __FILE__, 'iferch_deactivate_plugin_name' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-iferch_wp_plugin.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function iferch_run_plugin_name() {

	$plugin = new iFerch_Plugin();
	$plugin->run();

}
iferch_run_plugin_name();
