<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 * @author     Your Name <email@example.com>
 */
class iFerch_Plugin_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( 'iferchbootstrapcss', plugin_dir_url( __FILE__ ) . 'css/bootstrap.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/iferch_wp_plugin-admin.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'iferchtimerrrrrstrapcss', plugin_dir_url( __FILE__ ) . 'css/jquery.datetimepicker.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'iferchfontawesomecss', 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'iferchfontawesomecss', 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'iferchpagitimercss', 'https://cdnjs.cloudflare.com/ajax/libs/simplePagination.js/1.4/simplePagination.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'iferchtelstylecss', 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.min.css', array(), $this->version, 'all' );


	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( 'iferchjquery', plugin_dir_url( __FILE__ ) . 'js/jquery-3.6.0.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/iferch_wp_plugin-admin.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iferchboostrapjs', plugin_dir_url( __FILE__ ) . 'js/bootstrap.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iferchtelinputjs',  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iferchtelinputjs2',  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iferchpaginetimerjs', 'https://cdnjs.cloudflare.com/ajax/libs/simplePagination.js/1.4/jquery.simplePagination.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iferchtimerjs', plugin_dir_url( __FILE__ ) . 'js/jquery.datetimepicker.full.min.js', array( 'jquery' ), $this->version, false );





	}


	/**
	 * Add our custom menu.
	 *
	 * @since    1.0.0
	 */

	 public function iferch_admin_menu(){
		 add_menu_page('iFerch', 'iFerch', 'manage_options', 'iferch', array($this, 'iferch_wp_plugin_admin_single'), 'dashicons-car', 5);
		//  add_submenu_page('iferch', 'iFerch Single Delivery', 'Single Delivery', 'manage_options', 'iferch_wp_plugin_submenu_slug1', array($this, 'iferch_wp_plugin_admin_sub_ui'), 1);
		 add_submenu_page('iferch', 'iFerch Multiple Delivery', 'Multiple Delivery', 'manage_options', 'iferch_multi', array($this, 'iferch_wp_plugin_admin_multi'), 2);
		 add_submenu_page('iferch', 'iFerch Ongoing Delivery', 'Ongoing', 'manage_options', 'iferch_ongoing', array($this, 'iferch_wp_plugin_admin_ongoing'), 3);
		 add_submenu_page('iferch', 'iFerch Upcoming Delivery', 'Upcoming', 'manage_options', 'iferch_upcoming', array($this, 'iferch_wp_plugin_admin_upcoming'), 4);
		 add_submenu_page('iferch', 'iFerch Delivery History', 'History', 'manage_options', 'iferch_history', array($this, 'iferch_wp_plugin_admin_history'), 5);
		 add_submenu_page('iferch', 'iFerch Delivery Settings', 'Settings', 'manage_options', 'iferch_settings', array($this, 'iferch_wp_plugin_admin_setting'), 6);
	 }

	 /**
	 * Add sinlge delivery ui.
	 *
	 * @since    1.0.0
	 */

	 public function iferch_wp_plugin_admin_single(){
		 require_once 'partials/iferch_wp_plugin_admin_single.php';
	 }

	 /**
	 * Add multi delivery ui.
	 *
	 * @since    1.0.0
	 */
	 public function iferch_wp_plugin_admin_multi(){
		 require_once "partials/iferch_wp_plugin_admin_multi.php";
	 }

	  /**
	 * Add ongoing delivery ui.
	 *
	 * @since    1.0.0
	 */
	public function iferch_wp_plugin_admin_ongoing(){
		require_once "partials/iferch_wp_plugin_admin_ongoing.php";
	}

	 /**
	 * Add upcoming ui.
	 *
	 * @since    1.0.0
	 */
	public function iferch_wp_plugin_admin_upcoming(){
		require_once "partials/iferch_wp_plugin_admin_upcoming.php";
	}
	// iferch_wp_plugin_admin_settings.php


	 /**
	 * Add history ui.
	 *
	 * @since    1.0.0
	 */
	public function iferch_wp_plugin_admin_history(){
		require_once "partials/iferch_wp_plugin_admin_history.php";
	}

	/**
	 * Add settings ui.
	 *
	 * @since    1.0.0
	 */
	public function iferch_wp_plugin_admin_setting(){
		require_once "partials/iferch_wp_plugin_admin_settings.php";
	}

	 /**
	 * Add custom post fields.
	 *
	 * @since    1.0.0
	 */

	 public function iferch_register_general_settings(){
		 register_setting('iferch_custom_settings', 'iferch_apikey');
		 register_setting('iferch_custom_settings', 'iferch_serviceId');
	 }
}
