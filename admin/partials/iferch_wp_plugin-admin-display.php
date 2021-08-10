<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<div>
    <form action="options.php" class="row mt-4" method="POST">
        <?php 
        settings_fields('iferch_custom_settings');
        do_settings_sections('iferch_custom_settings');
        ?>
        <input type="text" class="col-md-12 mt-2" name="iferch_apikey" value="<?= get_option('iferch_apikey')?>">
        <input name="iferch_serviceId"  class="col-md-12 mt-2" value="<?= get_option('iferch_serviceId')?>" type="text">
        <input type="submit" class="col-md-12 mt-2">
    </form>
</div>