<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Image SEO
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
if( ! function_exists( 'image_seo_init' ) ) :
	function image_seo_init() { // phpcs:ignore

		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		// Register block styles for both frontend + backend.
		wp_register_style(
			'image_seo-style-css', // Handle.
			plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
			is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
			null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
		);

		// Register block editor script for backend.
		wp_register_script(
			'image_seo-block-js', // Handle.
			plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
			null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
			true // Enqueue the script in the footer.
		);

		// Register block editor styles for backend.
		wp_register_style(
			'image_seo-block-editor-css', // Handle.
			plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
			array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
			null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
		);

		// WP Localized globals. Use dynamic PHP stuff in JavaScript via `ImageSEOVars` object.
		wp_localize_script(
			'image_seo-block-js',
			'ImageSEOVars', // Array containing dynamic data for a JS Global.
			array(
				'isRankMathActive' => is_plugin_active( 'seo-by-rank-math/rank-math.php' ) ? 'yes' : 'no',
				'isYoastActive' => is_plugin_active( 'wordpress-seo/wp-seo.php' ) ? 'yes' : 'no',
				'pluginDirPath' => plugin_dir_path( __DIR__ ),
				'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
				// Add more data here that you want to access from `ImageSEOVars` object.
			)
		);

		/**
		 * Register Gutenberg block on server-side.
		 *
		 * Register the block on server-side to ensure that the block
		 * scripts and styles for both frontend and backend are
		 * enqueued when the editor loads.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
		 * @since 1.16.0
		 */
		register_block_type(
			'image-seo/image-seo', array(
				// Enqueue blocks.style.build.css on both frontend & backend.
				'style'         => 'image_seo-style-css',
				// Enqueue blocks.build.js in the editor only.
				'editor_script' => 'image_seo-block-js',
				// Enqueue blocks.editor.build.css in the editor only.
				'editor_style'  => 'image_seo-block-editor-css',
			)
		);
	}

	// Hook: Block assets.
	add_action( 'init', 'image_seo_init' );
endif;

if( ! function_exists( 'image_seo_add_post_metas' ) ) :
	/**
	 * Add Rest API support for Post Meta
	 * 
	 * @return void
	 */
	function image_seo_add_post_metas() {

		register_post_meta( '', 'rank_math_focus_keyword', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
		) );

		register_post_meta( '', '_yoast_wpseo_focuskw', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
		) );
	}
	add_action( 'init', 'image_seo_add_post_metas' );
endif;