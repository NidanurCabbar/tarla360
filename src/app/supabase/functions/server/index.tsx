import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

console.log('Tarla360 API Server starting...');

// Create Supabase admin client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Root endpoint
app.get('/make-server-7a7385c4/', (c) => {
  return c.json({ message: 'Tarla360 API Server', version: '1.0.0' });
});

// Initialize admin account endpoint
app.post('/make-server-7a7385c4/init-admin', async (c) => {
  try {
    const adminEmail = 'kemal.yesilirmak@tarla360.com';
    const adminPassword = 'TarlaYonetici2024!';
    
    // Check if admin already exists
    const existingAdmin = await kv.getByPrefix('user:');
    const adminExists = existingAdmin.some((u: any) => u.email === adminEmail);
    
    if (adminExists) {
      return c.json({ 
        success: true, 
        message: 'Admin account already exists',
        alreadyExists: true 
      });
    }

    // Create admin user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        firstName: 'Kemal',
        lastName: 'Yeşilırmak',
        role: 'admin'
      }
    });

    if (authError) {
      console.log('Error creating admin account:', authError);
      
      // If user already exists in auth but not in KV, just return success
      if (authError.message.includes('already registered')) {
        return c.json({ 
          success: true, 
          message: 'Admin account already exists in auth',
          alreadyExists: true 
        });
      }
      
      return c.json({ error: authError.message }, 400);
    }
    
    if (!authData.user) {
      return c.json({ error: 'Failed to create admin user' }, 500);
    }

    // Store admin profile in KV store
    const adminProfile = {
      id: authData.user.id,
      email: adminEmail,
      firstName: 'Kemal',
      lastName: 'Yeşilırmak',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${authData.user.id}`, adminProfile);

    console.log('Admin account created successfully:', adminProfile.id);

    return c.json({ 
      success: true, 
      message: 'Admin account created successfully',
      user: adminProfile
    });

  } catch (error) {
    console.log('Error in init-admin endpoint:', error);
    return c.json({ error: 'Internal server error during admin initialization' }, 500);
  }
});

// Debug endpoint to list users (temporary for debugging)
app.get('/make-server-7a7385c4/debug/users', async (c) => {
  try {
    const allUsers = await kv.getByPrefix('user:');
    return c.json({ 
      count: allUsers.length,
      users: allUsers.map(u => ({ 
        id: u.id, 
        email: u.email, 
        role: u.role,
        createdAt: u.createdAt 
      }))
    });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// User signup endpoint
app.post('/make-server-7a7385c4/signup', async (c) => {
  try {
    const { email, password, firstName, lastName, role, tcNo, birthDate, phone } = await c.req.json();

    if (!email || !password || !firstName || !lastName || !role || !tcNo || !birthDate || !phone) {
      return c.json({ error: 'Tüm alanlar zorunludur' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server is not configured
      user_metadata: {
        firstName,
        lastName,
        role,
        tcNo,
        birthDate,
        phone
      }
    });

    if (authError) {
      console.log('Auth error during signup:', authError);
      
      // Handle specific error cases
      if (authError.message.includes('already registered')) {
        return c.json({ error: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.' }, 400);
      }
      
      return c.json({ error: authError.message }, 400);
    }
    
    if (!authData.user) {
      console.log('No user data returned after signup');
      return c.json({ error: 'Kullanıcı oluşturulamadı' }, 500);
    }

    // Store user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      firstName,
      lastName,
      role,
      tcNo,
      birthDate,
      phone,
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${authData.user.id}`, userProfile);

    return c.json({ 
      success: true, 
      user: userProfile,
      message: 'User created successfully' 
    });

  } catch (error) {
    console.log('Error in signup endpoint:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile endpoint (requires auth)
app.get('/make-server-7a7385c4/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while getting profile:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);

    if (!userProfile) {
      // If profile doesn't exist in KV, create it from auth metadata
      const profile = {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        role: user.user_metadata?.role || 'farmer',
        createdAt: user.created_at
      };
      await kv.set(`user:${user.id}`, profile);
      return c.json({ user: profile });
    }

    return c.json({ user: userProfile });

  } catch (error) {
    console.log('Error in profile endpoint:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Update user profile endpoint (requires auth)
app.put('/make-server-7a7385c4/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while updating profile:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { 
      firstName, 
      lastName, 
      email, 
      tcNo, 
      birthDate, 
      phone,
      currentPassword,
      newPassword 
    } = await c.req.json();

    // Get existing profile
    const existingProfile = await kv.get(`user:${user.id}`) as any;

    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // If password change is requested, verify current password and update
    if (currentPassword && newPassword) {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: existingProfile.email,
        password: currentPassword
      });

      if (signInError) {
        console.log('Password verification failed:', signInError);
        return c.json({ error: 'Mevcut şifre yanlış' }, 400);
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        console.log('Password update failed:', updateError);
        return c.json({ error: 'Şifre güncellenirken hata oluştu' }, 500);
      }
    }

    // Update email in Supabase Auth if changed
    if (email && email !== existingProfile.email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email }
      );

      if (emailError) {
        console.log('Email update failed:', emailError);
        return c.json({ error: 'E-posta güncellenirken hata oluştu' }, 500);
      }
    }

    // Update profile in KV store
    const updatedProfile = {
      ...existingProfile,
      firstName: firstName || existingProfile.firstName,
      lastName: lastName || existingProfile.lastName,
      email: email || existingProfile.email,
      tcNo: tcNo || existingProfile.tcNo,
      birthDate: birthDate || existingProfile.birthDate,
      phone: phone || existingProfile.phone,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ 
      success: true, 
      user: updatedProfile,
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.log('Error in profile update endpoint:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

// Create or get chat endpoint (requires auth)
app.post('/make-server-7a7385c4/chat/create', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while creating chat:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { equipmentId, equipmentName, ownerId, ownerName } = await c.req.json();

    if (!equipmentId || !ownerId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${user.id}`) as any;
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Check if chat already exists
    const allChats = await kv.getByPrefix('chat:');
    const existingChat = allChats.find((chat: any) => 
      chat.equipmentId === equipmentId && 
      chat.farmerId === user.id && 
      chat.ownerId === ownerId
    );

    if (existingChat) {
      return c.json({ 
        success: true, 
        chat: existingChat,
        alreadyExists: true 
      });
    }

    // Create new chat
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chat = {
      id: chatId,
      equipmentId,
      equipmentName,
      ownerId,
      ownerName,
      farmerId: user.id,
      farmerName: `${userProfile.firstName} ${userProfile.lastName}`,
      createdAt: new Date().toISOString()
    };

    await kv.set(`chat:${chatId}`, chat);

    return c.json({ 
      success: true, 
      chat,
      message: 'Chat created successfully' 
    });

  } catch (error) {
    console.log('Error in create chat endpoint:', error);
    return c.json({ error: 'Internal server error while creating chat' }, 500);
  }
});

// Get user chats endpoint (requires auth)
app.get('/make-server-7a7385c4/chat/list', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while getting chats:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all chats where user is either farmer or owner
    const allChats = await kv.getByPrefix('chat:');
    const userChats = allChats.filter((chat: any) => 
      chat.farmerId === user.id || chat.ownerId === user.id
    );

    // Get last message for each chat
    const chatsWithMessages = await Promise.all(
      userChats.map(async (chat: any) => {
        const messages = await kv.getByPrefix(`message:${chat.id}:`);
        const sortedMessages = messages.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        const lastMessage = sortedMessages[0];
        const unreadCount = sortedMessages.filter((msg: any) => 
          !msg.read && msg.senderId !== user.id
        ).length;

        return {
          ...chat,
          lastMessage: lastMessage?.message,
          lastMessageTime: lastMessage?.timestamp,
          unreadCount
        };
      })
    );

    // Sort by last message time
    chatsWithMessages.sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });

    return c.json({ chats: chatsWithMessages });

  } catch (error) {
    console.log('Error in get chats endpoint:', error);
    return c.json({ error: 'Internal server error while getting chats' }, 500);
  }
});

// Send message endpoint (requires auth)
app.post('/make-server-7a7385c4/chat/message', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while sending message:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { chatId, message } = await c.req.json();

    if (!chatId || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${user.id}`) as any;
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Verify chat exists and user is participant
    const chat = await kv.get(`chat:${chatId}`) as any;
    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    if (chat.farmerId !== user.id && chat.ownerId !== user.id) {
      return c.json({ error: 'Not authorized for this chat' }, 403);
    }

    // Create message
    const messageId = `message:${chatId}:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const chatMessage = {
      id: messageId,
      chatId,
      senderId: user.id,
      senderName: `${userProfile.firstName} ${userProfile.lastName}`,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    await kv.set(messageId, chatMessage);

    return c.json({ 
      success: true, 
      message: chatMessage 
    });

  } catch (error) {
    console.log('Error in send message endpoint:', error);
    return c.json({ error: 'Internal server error while sending message' }, 500);
  }
});

// Delete chat endpoint (requires auth)
app.delete('/make-server-7a7385c4/chat/:chatId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while deleting chat:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const chatId = c.req.param('chatId');

    if (!chatId) {
      return c.json({ error: 'Chat ID is required' }, 400);
    }

    // Get chat to verify ownership - add 'chat:' prefix if not present
    const chatKey = chatId.startsWith('chat:') ? chatId : `chat:${chatId}`;
    const chat = await kv.get(chatKey) as any;

    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    // Check if user is part of this chat
    if (chat.farmerId !== user.id && chat.ownerId !== user.id) {
      return c.json({ error: 'Not authorized to delete this chat' }, 403);
    }

    // Delete all messages in this chat
    const allMessages = await kv.getByPrefix('message:') as any[];
    const chatMessages = allMessages.filter((msg: any) => msg.chatId === chatId || msg.chatId === chat.id);
    
    const messageIds = chatMessages.map((msg: any) => msg.id);
    if (messageIds.length > 0) {
      await kv.mdel(messageIds);
    }

    // Delete the chat itself
    await kv.del(chatKey);

    return c.json({ success: true });

  } catch (error) {
    console.log('Error in delete chat endpoint:', error);
    return c.json({ error: 'Internal server error while deleting chat' }, 500);
  }
});

// Get chat messages endpoint (requires auth)
app.get('/make-server-7a7385c4/chat/:chatId/messages', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while getting messages:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const chatId = c.req.param('chatId');

    // Verify chat exists and user is participant - add 'chat:' prefix if not present
    const chatKey = chatId.startsWith('chat:') ? chatId : `chat:${chatId}`;
    const chat = await kv.get(chatKey) as any;
    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    if (chat.farmerId !== user.id && chat.ownerId !== user.id) {
      return c.json({ error: 'Not authorized for this chat' }, 403);
    }

    // Get all messages for this chat - use the chat's id from the object
    const messages = await kv.getByPrefix(`message:${chat.id}:`);
    
    // Sort by timestamp
    messages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Mark messages as read if they're not from current user
    for (const msg of messages) {
      if (msg.senderId !== user.id && !msg.read) {
        await kv.set(msg.id, { ...msg, read: true });
      }
    }

    return c.json({ 
      messages,
      chat 
    });

  } catch (error) {
    console.log('Error in get messages endpoint:', error);
    return c.json({ error: 'Internal server error while getting messages' }, 500);
  }
});

// Review user endpoint (requires auth)
app.post('/make-server-7a7385c4/review-user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while reviewing user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { reviewerId, targetUserId, rating, comment, rentalId, equipmentName } = await c.req.json();

    if (!targetUserId || !rating || !comment) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get reviewer profile
    const reviewerProfile = await kv.get(`user:${reviewerId}`) as any;
    if (!reviewerProfile) {
      return c.json({ error: 'Reviewer profile not found' }, 404);
    }

    // Get target user profile
    const targetProfile = await kv.get(`user:${targetUserId}`) as any;
    if (!targetProfile) {
      return c.json({ error: 'Target user profile not found' }, 404);
    }

    // Create review object
    const review = {
      id: `review:${targetUserId}:${Date.now()}`,
      reviewerId: reviewerId,
      reviewerName: `${reviewerProfile.firstName} ${reviewerProfile.lastName}`,
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split('T')[0],
      rentalId: rentalId,
      equipmentName: equipmentName,
      createdAt: new Date().toISOString()
    };

    // Save review
    await kv.set(review.id, review);

    // Update target user's rating
    const userReviews = await kv.getByPrefix(`review:${targetUserId}:`);
    const totalRating = userReviews.reduce((sum: number, r: any) => sum + r.rating, 0) + rating;
    const reviewCount = userReviews.length + 1;
    const averageRating = Number((totalRating / reviewCount).toFixed(1));

    await kv.set(`user:${targetUserId}`, {
      ...targetProfile,
      rating: averageRating,
      reviewCount: reviewCount,
      updatedAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      review,
      message: 'Review submitted successfully' 
    });

  } catch (error) {
    console.log('Error in review user endpoint:', error);
    return c.json({ error: 'Internal server error while submitting review' }, 500);
  }
});

// Update rental review status endpoint
app.post('/make-server-7a7385c4/update-rental-review-status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { rentalId, reviewType } = await c.req.json();

    const rental = await kv.get(`rental:${rentalId}`) as any;
    if (!rental) {
      return c.json({ error: 'Rental not found' }, 404);
    }

    const updatedRental = {
      ...rental,
      [reviewType === 'owner' ? 'ownerReviewed' : 'renterReviewed']: true
    };

    await kv.set(`rental:${rentalId}`, updatedRental);

    return c.json({ 
      success: true, 
      message: 'Rental review status updated' 
    });

  } catch (error) {
    console.log('Error in update rental review status endpoint:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user reviews endpoint
app.get('/make-server-7a7385c4/user-reviews/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const reviews = await kv.getByPrefix(`review:${userId}:`);
    
    // Sort by date descending
    reviews.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ reviews });

  } catch (error) {
    console.log('Error in get user reviews endpoint:', error);
    return c.json({ error: 'Internal server error while getting reviews' }, 500);
  }
});

// Create equipment listing endpoint (requires auth)
app.post('/make-server-7a7385c4/equipment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while creating equipment:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { 
      name, 
      category, 
      description, 
      pricePerDay, 
      location, 
      imageUrl,
      model,
      year,
      condition 
    } = await c.req.json();

    if (!name || !category || !description || !pricePerDay || !location) {
      return c.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır' }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${user.id}`) as any;
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Create equipment object
    const equipmentId = `equipment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const equipment = {
      id: equipmentId,
      name,
      category,
      description,
      pricePerDay: Number(pricePerDay),
      location,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      model: model || '',
      year: year || new Date().getFullYear(),
      condition: condition || 'Mükemmel',
      owner: `${userProfile.firstName} ${userProfile.lastName}`,
      ownerId: user.id,
      rating: 0,
      reviewCount: 0,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    await kv.set(`equipment:${equipmentId}`, equipment);

    return c.json({ 
      success: true, 
      equipment,
      message: 'İlan başarıyla oluşturuldu' 
    });

  } catch (error) {
    console.log('Error in create equipment endpoint:', error);
    return c.json({ error: 'Internal server error while creating equipment' }, 500);
  }
});

// Get all equipment listings endpoint
app.get('/make-server-7a7385c4/equipment', async (c) => {
  try {
    const allEquipment = await kv.getByPrefix('equipment:');
    
    // Sort by creation date descending
    allEquipment.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ equipment: allEquipment });

  } catch (error) {
    console.log('Error in get equipment endpoint:', error);
    return c.json({ error: 'Internal server error while getting equipment' }, 500);
  }
});

// Get equipment by ID endpoint
app.get('/make-server-7a7385c4/equipment/:equipmentId', async (c) => {
  try {
    const equipmentId = c.req.param('equipmentId');
    
    if (!equipmentId) {
      return c.json({ error: 'Equipment ID is required' }, 400);
    }

    const equipmentKey = equipmentId.startsWith('equipment:') ? equipmentId : `equipment:${equipmentId}`;
    const equipment = await kv.get(equipmentKey);

    if (!equipment) {
      return c.json({ error: 'Equipment not found' }, 404);
    }

    return c.json({ equipment });

  } catch (error) {
    console.log('Error in get equipment by ID endpoint:', error);
    return c.json({ error: 'Internal server error while getting equipment' }, 500);
  }
});

// Get user's equipment listings endpoint (requires auth)
app.get('/make-server-7a7385c4/my-equipment', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while getting user equipment:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allEquipment = await kv.getByPrefix('equipment:');
    const userEquipment = allEquipment.filter((eq: any) => eq.ownerId === user.id);
    
    // Sort by creation date descending
    userEquipment.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ equipment: userEquipment });

  } catch (error) {
    console.log('Error in get user equipment endpoint:', error);
    return c.json({ error: 'Internal server error while getting user equipment' }, 500);
  }
});

// Get user rentals endpoint
app.get('/make-server-7a7385c4/rentals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while fetching rentals:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all rentals for this user (as renter or owner)
    const allRentals = await kv.getByPrefix('rental:');
    const userRentals = allRentals.filter((rental: any) => 
      rental.renterId === user.id || rental.ownerId === user.id
    );

    return c.json({ 
      success: true, 
      rentals: userRentals 
    });
  } catch (error: any) {
    console.error('Error fetching rentals:', error);
    return c.json({ error: 'Failed to fetch rentals', details: error.message }, 500);
  }
});

// Complete rental endpoint (mark as delivered)
app.post('/make-server-7a7385c4/rentals/:rentalId/complete', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Authorization error while completing rental:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const rentalId = c.req.param('rentalId');
    const { deliveryDate, deliveryTime, deliveryImage } = await c.req.json();

    if (!deliveryDate || !deliveryTime) {
      return c.json({ error: 'Missing delivery date or time' }, 400);
    }

    // Get rental
    const rental = await kv.get(`rental:${rentalId}`) as any;
    if (!rental) {
      return c.json({ error: 'Rental not found' }, 404);
    }

    // Verify user is authorized (either renter or owner)
    if (rental.renterId !== user.id && rental.ownerId !== user.id) {
      return c.json({ error: 'Not authorized to complete this rental' }, 403);
    }

    // Update rental with delivery info
    rental.status = 'completed';
    rental.deliveryDate = deliveryDate;
    rental.deliveryTime = deliveryTime;
    rental.deliveryImage = deliveryImage || '';
    rental.completedAt = new Date().toISOString();

    await kv.set(`rental:${rentalId}`, rental);

    // Update equipment status back to available
    const equipment = await kv.get(`equipment:${rental.equipmentId}`) as any;
    if (equipment) {
      equipment.status = 'available';
      await kv.set(`equipment:${rental.equipmentId}`, equipment);
    }

    return c.json({ 
      success: true, 
      rental 
    });
  } catch (error: any) {
    console.error('Error completing rental:', error);
    return c.json({ error: 'Failed to complete rental', details: error.message }, 500);
  }
});

// Initialize categories and products endpoint
app.post('/make-server-7a7385c4/init-categories', async (c) => {
  try {
    console.log('Starting init-categories endpoint...');
    
    // Check if categories already exist
    const existingCategories = await kv.getByPrefix('category:');
    console.log('Existing categories count:', existingCategories.length);
    
    if (existingCategories.length > 0) {
      return c.json({ 
        success: true, 
        message: 'Kategoriler zaten mevcut',
        alreadyExists: true 
      });
    }

    // Define categories with their products
    const categories = [
      {
        id: 'ekim-dikim',
        name: 'Ekim/Dikim',
        icon: 'Sprout',
        products: [
          'Mibzer',
          'Fidan Dikim Makinesi',
          'Patates Dikim Makinesi',
          'Tohum Ekim Çubuğu'
        ]
      },
      {
        id: 'gubreleme-ilaclama',
        name: 'Gübreleme/İlaçlama',
        icon: 'Droplets',
        products: [
          'Gübre Serpme Makinesi',
          'Holder Pompa',
          'İlaçlama Drone',
          'İlaçlama Makinesi'
        ]
      },
      {
        id: 'hasat',
        name: 'Hasat',
        icon: 'Wheat',
        products: [
          'Balya Makinesi',
          'Biçerdöver',
          'Çalı Makası',
          'Mısır Hasat Makinesi',
          'Pamuk Hasat Makinesi',
          'Patates Hasat Makinesi',
          'Silaj Makinesi',
          'Traktör',
          'Zeytin Hasat Makinesi'
        ]
      },
      {
        id: 'sulama',
        name: 'Sulama',
        icon: 'Droplet',
        products: [
          'Damla Sulama',
          'Damla Sulama Sistemi',
          'Fıskiye Sistemi',
          'Su Pompası',
          'Pivot Sulama',
          'Sulama Dronu'
        ]
      },
      {
        id: 'tasima-depolama',
        name: 'Taşıma/Depolama',
        icon: 'Truck',
        products: [
          'Balya Sarmalayıcı',
          'Römork',
          'Tahıl Arabası',
          'Tanker',
          'Taşıma Bantları'
        ]
      },
      {
        id: 'toprak-isleme',
        name: 'Toprak İşleme',
        icon: 'Construction',
        products: [
          'Çapa Makinesi',
          'Dipkazan',
          'Diskaro',
          'Kültivatör',
          'Pulluk',
          'Rotovatör'
        ]
      }
    ];

    console.log('Storing categories...', categories.length);

    // Store categories
    for (const category of categories) {
      try {
        await kv.set(`category:${category.id}`, {
          id: category.id,
          name: category.name,
          icon: category.icon,
          products: category.products,
          createdAt: new Date().toISOString()
        });
        console.log(`Stored category: ${category.id}`);
      } catch (categoryError) {
        console.error(`Error storing category ${category.id}:`, categoryError);
        throw categoryError;
      }
    }

    console.log('Categories initialized successfully');

    return c.json({ 
      success: true, 
      message: 'Kategoriler başarıyla oluşturuldu',
      count: categories.length
    });

  } catch (error) {
    console.error('Error in init-categories endpoint:', error);
    console.error('Error details:', error.message, error.stack);
    return c.json({ error: `Kategoriler oluşturulurken hata oluştu: ${error.message}` }, 500);
  }
});

// Get all categories endpoint
app.get('/make-server-7a7385c4/categories', async (c) => {
  try {
    console.log('Fetching categories...');
    const categories = await kv.getByPrefix('category:');
    console.log('Found categories:', categories.length);
    
    // Sort by name
    categories.sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr'));

    return c.json({ 
      success: true,
      categories 
    });

  } catch (error) {
    console.error('Error in get categories endpoint:', error);
    console.error('Error details:', error.message, error.stack);
    return c.json({ error: `Kategoriler getirilirken hata oluştu: ${error.message}` }, 500);
  }
});

// Initialize sample equipment endpoint
app.post('/make-server-7a7385c4/init-equipment', async (c) => {
  try {
    console.log('Starting init-equipment endpoint...');
    
    // Check if equipment already exists
    const existingEquipment = await kv.getByPrefix('equipment:');
    console.log('Existing equipment count:', existingEquipment.length);
    
    if (existingEquipment.length > 0) {
      return c.json({ 
        success: true, 
        message: 'Ekipmanlar zaten mevcut',
        alreadyExists: true,
        count: existingEquipment.length
      });
    }

    console.log('Creating sample equipment data...');

    // Sample equipment data based on categories (34 products from Excel)
    const sampleEquipment = [
      // Ekim/Dikim kategorisi
      {
        name: 'Mibzer',
        category: 'Ekim/Dikim',
        description: 'Hububat ekimi için profesyonel mibzer. 24 sıralı, hassas ekim özelliği.',
        pricePerDay: 850,
        pricePerHour: 120,
        location: 'Konya, Karatay',
        neighborhood: 'Selçuklu Mahallesi',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        rating: 4.8,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Fidan Dikim Makinesi',
        category: 'Ekim/Dikim',
        description: 'Otomatik fidan dikim makinesi. Meyve bahçeleri için ideal.',
        pricePerDay: 650,
        pricePerHour: 90,
        location: 'Antalya, Aksu',
        neighborhood: 'Göçerler Mahallesi',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Patates Dikim Makinesi',
        category: 'Ekim/Dikim',
        description: '4 sıralı patates dikim makinesi. Yüksek verimlilik.',
        pricePerDay: 720,
        pricePerHour: 100,
        location: 'Niğde, Merkez',
        neighborhood: 'Yenice Mahallesi',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Tohum Ekim Çubuğu',
        category: 'Ekim/Dikim',
        description: 'Manuel tohum ekim çubuğu. Küçük alanlar için pratik.',
        pricePerDay: 180,
        pricePerHour: 25,
        location: 'Bursa, İnegöl',
        neighborhood: 'Kemalpaşa Mahallesi',
        image: 'https://images.unsplash.com/photo-1566521898189-b1c3b5072a4c?w=800',
        rating: 4.3,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      // Gübreleme/İlaçlama kategorisi
      {
        name: 'Gübre Serpme Makinesi',
        category: 'Gübreleme/İlaçlama',
        description: 'Katı gübre serpme makinesi. 1000 kg kapasiteli.',
        pricePerDay: 480,
        pricePerHour: 65,
        location: 'Konya, Ereğli',
        neighborhood: 'Cumhuriyet Mahallesi',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Holder Pompa',
        category: 'Gübreleme/İlaçlama',
        description: 'Yüksek basınçlı holder pompa. İlaçlama ve gübreleme için.',
        pricePerDay: 420,
        pricePerHour: 60,
        location: 'Adana, Yüreğir',
        neighborhood: 'Köprülü Mahallesi',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
        rating: 4.4,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'İlaçlama Drone',
        category: 'Gübreleme/İlaçlama',
        description: 'Modern tarım drone. 10L tank kapasiteli, GPS destekli.',
        pricePerDay: 1500,
        pricePerHour: 200,
        location: 'İzmir, Bornova',
        neighborhood: 'Erzene Mahallesi',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        rating: 4.9,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'İlaçlama Makinesi',
        category: 'Gübreleme/İlaçlama',
        description: 'Kuyruk milinden hareketli tarla pülverizatörü. 600L.',
        pricePerDay: 550,
        pricePerHour: 75,
        location: 'Şanlıurfa, Viranşehir',
        neighborhood: 'Yenişehir Mahallesi',
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      // Hasat kategorisi
      {
        name: 'Balya Makinesi',
        category: 'Hasat',
        description: 'Yuvarlak balya makinesi. 120cm çapında balya yapma.',
        pricePerDay: 950,
        pricePerHour: 130,
        location: 'Çorum, Merkez',
        neighborhood: 'Bahçelievler Mahallesi',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Biçerdöver',
        category: 'Hasat',
        description: 'Yeni nesil biçerdöver. 6m biçme genişliği, modern teknoloji.',
        pricePerDay: 3500,
        pricePerHour: 450,
        location: 'Konya, Çumra',
        neighborhood: 'Fatih Mahallesi',
        image: 'https://images.unsplash.com/photo-1595262729645-50c69e7a01f5?w=800',
        rating: 4.9,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Çalı Makası',
        category: 'Hasat',
        description: 'Motorlu çalı makası. Bağ ve bahçe için ideal.',
        pricePerDay: 220,
        pricePerHour: 30,
        location: 'Manisa, Akhisar',
        neighborhood: 'Zeytinliova Mahallesi',
        image: 'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=800',
        rating: 4.2,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Mısır Hasat Makinesi',
        category: 'Hasat',
        description: '4 sıralı mısır hasat makinesi. Yüksek performans.',
        pricePerDay: 1800,
        pricePerHour: 240,
        location: 'Osmaniye, Merkez',
        neighborhood: 'Raufpaşa Mahallesi',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        rating: 4.8,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Pamuk Hasat Makinesi',
        category: 'Hasat',
        description: '6 sıralı pamuk hasat makinesi. Modern teknoloji.',
        pricePerDay: 2800,
        pricePerHour: 360,
        location: 'Adana, Ceyhan',
        neighborhood: 'Kaypak Mahallesi',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        rating: 4.9,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Patates Hasat Makinesi',
        category: 'Hasat',
        description: '2 sıralı patates hasat makinesi. Hasar oranı düşük.',
        pricePerDay: 1200,
        pricePerHour: 160,
        location: 'Nevşehir, Merkez',
        neighborhood: 'Bahçelievler Mahallesi',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
        rating: 4.6,
        status: 'Kiralıkta',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Silaj Makinesi',
        category: 'Hasat',
        description: 'Otomatik silaj makinesi. Yüksek kapasiteli.',
        pricePerDay: 1600,
        pricePerHour: 210,
        location: 'Kars, Merkez',
        neighborhood: 'Yenişehir Mahallesi',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Traktör',
        category: 'Hasat',
        description: 'New Holland 110HP traktör. Klimalı kabin, çok amaçlı kullanım.',
        pricePerDay: 1400,
        pricePerHour: 180,
        location: 'Konya, Karatay',
        neighborhood: 'Mengene Mahallesi',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        rating: 4.8,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Zeytin Hasat Makinesi',
        category: 'Hasat',
        description: 'Titreşimli zeytin hasat makinesi. Ağaca zarar vermez.',
        pricePerDay: 780,
        pricePerHour: 105,
        location: 'Aydın, Nazilli',
        neighborhood: 'Sümer Mahallesi',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      // Sulama kategorisi
      {
        name: 'Damla Sulama',
        category: 'Sulama',
        description: 'Damla sulama sistemi kurulumu. 1 dekar için komple set.',
        pricePerDay: 350,
        pricePerHour: 50,
        location: 'Antalya, Serik',
        neighborhood: 'Çenger Mahallesi',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        rating: 4.4,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Damla Sulama Sistemi',
        category: 'Sulama',
        description: 'Mobil damla sulama sistemi. Kolay kurulum.',
        pricePerDay: 420,
        pricePerHour: 60,
        location: 'Mersin, Tarsus',
        neighborhood: 'Şehit Mahallesi',
        image: 'https://images.unsplash.com/photo-1566521898189-b1c3b5072a4c?w=800',
        rating: 4.3,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Fıskiye Sistemi',
        category: 'Sulama',
        description: 'Yüksek basınçlı fıskiye sulama sistemi. 3 dönüm alan.',
        pricePerDay: 550,
        pricePerHour: 75,
        location: 'Konya, Karapınar',
        neighborhood: 'Yeni Mahalle',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Su Pompası',
        category: 'Sulama',
        description: 'Dizel motorlu su pompası. 200m³/saat kapasiteli.',
        pricePerDay: 380,
        pricePerHour: 55,
        location: 'Şanlıurfa, Merkez',
        neighborhood: 'Akabe Mahallesi',
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Pivot Sulama',
        category: 'Sulama',
        description: 'Merkezi pivot sulama sistemi. 10 hektarlık alan için.',
        pricePerDay: 2400,
        pricePerHour: 320,
        location: 'Konya, Çumra',
        neighborhood: 'Kaşınhanı Mahallesi',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
        rating: 4.9,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Sulama Dronu',
        category: 'Sulama',
        description: 'Tarımsal sulama drone. Hassas sulama teknolojisi.',
        pricePerDay: 1800,
        pricePerHour: 240,
        location: 'İzmir, Torbalı',
        neighborhood: 'Tepeköy Mahallesi',
        image: 'https://images.unsplash.com/photo-1595262729645-50c69e7a01f5?w=800',
        rating: 4.8,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      // Taşıma/Depolama kategorisi
      {
        name: 'Balya Sarmalayıcı',
        category: 'Taşıma/Depolama',
        description: 'Otomatik balya sarma makinesi. Yüksek hız.',
        pricePerDay: 680,
        pricePerHour: 95,
        location: 'Çorum, Osmancık',
        neighborhood: 'Bahçelievler Mahallesi',
        image: 'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Römork',
        category: 'Taşıma/Depolama',
        description: 'Tarım römorku. 8 ton taşıma kapasiteli, çift dingil.',
        pricePerDay: 450,
        pricePerHour: 65,
        location: 'Konya, Ereğli',
        neighborhood: 'İstiklal Mahallesi',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        rating: 4.4,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Tahıl Arabası',
        category: 'Taşıma/Depolama',
        description: 'Damperli tahıl arabası. 12 ton kapasiteli.',
        pricePerDay: 550,
        pricePerHour: 75,
        location: 'Edirne, Merkez',
        neighborhood: 'Yıldırım Mahallesi',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Tanker',
        category: 'Taşıma/Depolama',
        description: 'Su/gübre tankeri. 5000L kapasiteli, paslanmaz çelik.',
        pricePerDay: 620,
        pricePerHour: 85,
        location: 'Adana, Yüreğir',
        neighborhood: 'Köprülü Mahallesi',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Taşıma Bantları',
        category: 'Taşıma/Depolama',
        description: 'Mobil taşıma bandı. Tahıl ve ürün yükleme için.',
        pricePerDay: 280,
        pricePerHour: 40,
        location: 'Balıkesir, Bandırma',
        neighborhood: 'Paşaalanı Mahallesi',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
        rating: 4.2,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      // Toprak İşleme kategorisi
      {
        name: 'Çapa Makinesi',
        category: 'Toprak İşleme',
        description: 'Mekanik çapa makinesi. 6 sıralı yabani ot temizliği.',
        pricePerDay: 520,
        pricePerHour: 70,
        location: 'Konya, Karatay',
        neighborhood: 'Şeker Mahallesi',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Dipkazan',
        category: 'Toprak İşleme',
        description: 'Ağır dipkazan. 70cm derinlik, 3 ayaklı.',
        pricePerDay: 850,
        pricePerHour: 115,
        location: 'Tokat, Merkez',
        neighborhood: 'Yeşilyurt Mahallesi',
        image: 'https://images.unsplash.com/photo-1566521898189-b1c3b5072a4c?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Diskaro',
        category: 'Toprak İşleme',
        description: 'Ağır diskaro. 32 diskli, ayarlanabilir açı.',
        pricePerDay: 720,
        pricePerHour: 100,
        location: 'Konya, Çumra',
        neighborhood: 'Cumhuriyet Mahallesi',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      },
      {
        name: 'Kültivatör',
        category: 'Toprak İşleme',
        description: 'Hidrolik katlanır kültivatör. 3m çalışma genişliği.',
        pricePerDay: 580,
        pricePerHour: 80,
        location: 'Ankara, Polatlı',
        neighborhood: 'Zafer Mahallesi',
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800',
        rating: 4.5,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-3'
      },
      {
        name: 'Pulluk',
        category: 'Toprak İşleme',
        description: 'Kuyruk ayarlı pulluk. 5 gövdeli, kaliteli çelik.',
        pricePerDay: 620,
        pricePerHour: 85,
        location: 'Tekirdağ, Çorlu',
        neighborhood: 'Muhittin Mahallesi',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
        rating: 4.6,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-1'
      },
      {
        name: 'Rotovatör',
        category: 'Toprak İşleme',
        description: 'Ağır rotovatör. 2.5m çalışma genişliği, toprak hazırlama.',
        pricePerDay: 680,
        pricePerHour: 95,
        location: 'Bursa, Karacabey',
        neighborhood: 'Cumhuriyet Mahallesi',
        image: 'https://images.unsplash.com/photo-1595262729645-50c69e7a01f5?w=800',
        rating: 4.7,
        status: 'Müsait',
        owner: 'Demo Kullanıcı',
        ownerId: 'demo-owner-2'
      }
    ];

    console.log('Storing equipment items...', sampleEquipment.length);

    // Store equipment
    for (let i = 0; i < sampleEquipment.length; i++) {
      try {
        const equipment = sampleEquipment[i];
        const equipmentId = `equipment_${Date.now()}_${i}`;
        await kv.set(`equipment:${equipmentId}`, {
          id: equipmentId,
          ...equipment,
          createdAt: new Date().toISOString()
        });
        console.log(`Stored equipment ${i + 1}/${sampleEquipment.length}: ${equipment.name}`);
      } catch (equipmentError) {
        console.error(`Error storing equipment ${i}:`, equipmentError);
        throw equipmentError;
      }
    }

    console.log('Sample equipment initialized successfully');

    return c.json({ 
      success: true, 
      message: 'Ekipmanlar başarıyla oluşturuldu',
      count: sampleEquipment.length
    });

  } catch (error) {
    console.error('Error in init-equipment endpoint:', error);
    console.error('Error details:', error.message, error.stack);
    return c.json({ error: `Ekipmanlar oluşturulurken hata oluştu: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);