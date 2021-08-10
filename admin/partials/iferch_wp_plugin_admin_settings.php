<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://iferch.com
 * @since      1.0.0
 *
 * @package    iFerch_Plugin
 * @subpackage iFerch_Plugin/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<span id="iferch-settings"></span>

<div class="iferch-header-box">
    <img class="iferch-logo" src="https://www.iferch.com/assets/img/1024x1024.png" alt="iferch logo">
    <h6> <i class="fa fa-cog text-info"></i> Settings</h6>
</div>


<div class="container">
    <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <div class="card">
                <h6>Settings: </h6>
                <p>To use iFerch wordpress plugin you need to obtain an API key and a Service ID</p>
                <p>Enter the API key and Service Id in the form below</p>
            </div>
            <div class="card">
                <div class="row0">
                    <form action="options.php" class="row" method="POST">
                        <?php
                        settings_fields('iferch_custom_settings');
                        do_settings_sections('iferch_custom_settings');
                        ?>
                        <p class="mt-2 iferch-no-margin">API Key: </p>
                        <input type="text" class="col-md-12 form-control" name="iferch_apikey" value="<?= get_option('iferch_apikey') ?>" placeholder="Api Key">
                        <p class="mt-2 iferch-no-margin">Service Id:</p>
                        <input name="iferch_serviceId" class="col-md-12  form-control" value="<?= get_option('iferch_serviceId') ?>" type="text" placeholder="Service Id">
                        <div style="display: flex; justify-content: flex-end">
                            <input type="submit" class="mt-2 btn btn-primary" value="Save">
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-3">
        </div>
    </div>

</div>