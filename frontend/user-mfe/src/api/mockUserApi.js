let users = [
  { 
    id: 'u1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    password: 'pass', 
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate about building scalable web applications and mentoring junior developers.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    connections: 523,
    followers: [], 
    following: [] 
  },
  { 
    id: 'u2', 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    password: 'pass', 
    title: 'Product Manager',
    location: 'New York, NY',
    bio: 'Building products that users love. Always looking for the next big opportunity.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    connections: 892,
    followers: [], 
    following: [] 
  }
];

function delay(ms=200){ return new Promise(res=>setTimeout(res, ms)); }

export default {
  async login({ email, password }){
    await delay();
    const u = users.find(x=>x.email===email && x.password===password);
    if (!u) throw new Error('Invalid credentials');
    // return shallow copy without password
    const { password: _p, ...rest } = u;
    return { ...rest };
  },
  async register({ name, email, password, title, location, bio, photo }){
    await delay();
    if (users.find(x=>x.email===email)) throw new Error('Email exists');
    const id = 'u' + (users.length + 1);
    const u = { 
      id, 
      name, 
      email, 
      password,
      title: title || 'Professional',
      location: location || 'Location not set',
      bio: bio || '',
      photo: photo || 'https://randomuser.me/api/portraits/lego/1.jpg',
      connections: 0,
      followers: [], 
      following: [] 
    };
    users.push(u);
    const { password: _p, ...rest } = u;
    return { ...rest };
  },
  async list(){ 
    await delay(); 
    return users.map(u=>{ const { password, ...r } = u; return r; }); 
  },
  async follow(fromId, toId){ 
    await delay(); 
    const f = users.find(x=>x.id===fromId); 
    const t = users.find(x=>x.id===toId); 
    if(!f||!t) throw new Error('User not found'); 
    if(!f.following.includes(toId)) f.following.push(toId); 
    if(!t.followers.includes(fromId)) t.followers.push(fromId); 
    return true; 
  },
  async unfollow(fromId, toId){ 
    await delay(); 
    const f = users.find(x=>x.id===fromId); 
    const t = users.find(x=>x.id===toId); 
    if(!f||!t) throw new Error('User not found'); 
    f.following = f.following.filter(i=>i!==toId); 
    t.followers = t.followers.filter(i=>i!==fromId); 
    return true; 
  }
}

