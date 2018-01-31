
<?php if ($page['header']): ?>    
	  <?php print render($page['header']); ?>
<?php endif; ?>

<?php if ($page['highlighted']): ?>    
	  <?php print render($page['highlighted']); ?>
<?php endif; ?> 

<?php if ($page['content']): ?>    
		<?php print render($page['content']); ?>	  
<?php endif; ?> 

<?php if ($page['footer']): ?>    
	  <?php print render($page['footer']); ?>
<?php endif; ?> 

  
  