// test-supabase.js
import supabase from './db.js';

console.log("Probando Supabase con tus tablas...");

try {
  // 1. Insertar un usuario
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      email: 'test@example.com',
      password_hash: 'hashed_password_123',
      first_name: 'Test',
      last_name: 'User',
      role: 'BUYER'
    })
    .select()
    .single();

  if (userError) throw userError;

  console.log("Usuario creado:", user.id);

  // 2. Insertar un producto
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: 'iPhone 15',
      description: 'Smartphone de prueba',
      category: 'Electronics',
      external_link: 'https://apple.com'
    })
    .select()
    .single();

  if (productError) throw productError;

  console.log("Producto creado:", product.id);

  // 3. Insertar una reseña
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .insert({
      product_id: product.id,
      user_id: user.id,
      content: '¡Excelente producto!',
      rating: 5,
      sentiment: 'POSITIVE'
    })
    .select()
    .single();

  if (reviewError) throw reviewError;

  console.log("Reseña creada:", review.id);

  // 4. Consultar analítica
  const { data: analytics, error: analyticsError } = await supabase
    .rpc('calculate_product_analytics', { p_product_id: product.id });

  if (analyticsError) throw analyticsError;

  console.log("Analítica del producto:", analytics[0]);

  console.log("¡TODO FUNCIONA PERFECTAMENTE!");

} catch (err) {
  console.error("ERROR:", err.message);
}