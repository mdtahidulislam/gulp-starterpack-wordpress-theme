<?php get_header(); ?>

<!-- post -->
<?php 
    if (have_posts()) {
?>
    <?php while(have_posts()) {?>
        <?php the_post(); ?>
        <!-- post title -->
        <h2>
            <a href="<?php the_permalink(); ?>" titile="<?php the_title_attribute(); ?>">
                <?php the_title(); ?>
            </a>
        </h2>
        <!-- post meta data  -->
        <div>
        <!-- date -->
            posted on <a href="<?php echo get_the_permalink() ?>">
                <time datetime="<?php echo get_the_date(c); ?>"><?php echo get_the_date('l, F j, Y') ;?></time>
            </a>
        <!-- author -->, BY
            <a href="<?php echo get_author_posts_url(get_the_author_meta( 'ID')) ;?>"><?php echo get_the_author() ;?></a>
        </div>
        <!-- excerpt -->
        <p><?php the_excerpt(  ); ?></p>
        <!-- read more link -->
        <a href="<?php echo get_the_permalink(); ?>" tiitle="<?php the_title_attribute(); ?>">Read More...</a>
    <?php
    }
    ?>
    <?php the_posts_pagination(); ?> 
<?php 
    } else {
        echo 'there is no posts yet!!!';
    }
?>

<?php get_footer(); ?>
    
