<?php

// add assets into head
function _themename_assets(){
    wp_enqueue_style( 'style-sheet', get_template_directory_uri( ).'/dist/assets/css/style.css', array(), '1.0', 'all' );
    wp_enqueue_script( 'main-js', get_template_directory_uri(  ).'/dist/assets/js/main.js', array(), '1.0', true );
}
add_action('wp_enqueue_scripts', '_themename_assets');

function _themename_admin_assets(){
    wp_enqueue_style( 'adminstyle', get_template_directory_uri( ).'/dist/assets/css/admin.css', array(), '1.0', 'all' );
    wp_enqueue_script( 'adminjs', get_template_directory_uri( ).'/dist/assets/js/admin.js', array(), '1.0', true );
}
add_action('admin_enqueue_scripts', '_themename_admin_assets');



