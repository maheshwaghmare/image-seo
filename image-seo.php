<?php
/**
 * Plugin Name: Image SEO
 * Description: Easy to do the image SEO for the post, pages and custom post type content images for the Gutenberg.
 * Plugin URI: https://github.com/maheshwaghmare/image-seo/
 * Author: Mahesh M. Waghmare
 * Author URI: https://maheshwaghmare.com/
 * Version: 1.0.0
 * License: GPL2
 * Text Domain: image-seo
 *
 * @package Image SEO
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Set constants.
define( 'IMAGE_SEO_VER', '1.0.0' );
define( 'IMAGE_SEO_FILE', __FILE__ );
define( 'IMAGE_SEO_BASE', plugin_basename( IMAGE_SEO_FILE ) );
define( 'IMAGE_SEO_DIR', plugin_dir_path( IMAGE_SEO_FILE ) );
define( 'IMAGE_SEO_URI', plugins_url( '/', IMAGE_SEO_FILE ) );

require_once IMAGE_SEO_DIR . 'src/init.php';