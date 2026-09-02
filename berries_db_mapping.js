export async function getCrops() {
  const { data, error } = await supabase.from('berry_crops').select('*');
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    type: row.berry_type,
    location: row.location,
    plantedAt: new Date(row.planted_at).getTime(),
    waterCount: row.water_count,
    watered: row.water_count > 0,
    wateredAt: row.last_watered_at ? new Date(row.last_watered_at).getTime() : null,
    // Add fake initialDryHours since it's cached in frontend, frontend will just rely on dbInfo later if missing
    initialDryHours: 2 // placeholder, berries.js uses dbInfo to override if needed
  }));
}

export async function addCrop(crop) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');
  
  const dbCrop = {
    id: crop.id,
    user_id: session.user.id,
    berry_type: crop.type,
    location: crop.location || '',
    planted_at: new Date(crop.plantedAt).toISOString(),
    water_count: crop.waterCount || (crop.watered ? 1 : 0),
    last_watered_at: crop.wateredAt ? new Date(crop.wateredAt).toISOString() : null,
    harvested: false
  };

  const { data, error } = await supabase.from('berry_crops').insert([dbCrop]).select();
  if (error) throw error;
  return data[0];
}

export async function updateCrop(id, updateData) {
  const dbData = {};
  if (updateData.type !== undefined) dbData.berry_type = updateData.type;
  if (updateData.location !== undefined) dbData.location = updateData.location;
  if (updateData.plantedAt !== undefined) dbData.planted_at = new Date(updateData.plantedAt).toISOString();
  if (updateData.waterCount !== undefined) dbData.water_count = updateData.waterCount;
  if (updateData.watered !== undefined && updateData.waterCount === undefined) dbData.water_count = updateData.watered ? 1 : 0;
  if (updateData.wateredAt !== undefined) dbData.last_watered_at = updateData.wateredAt ? new Date(updateData.wateredAt).toISOString() : null;

  const { data, error } = await supabase.from('berry_crops').update(dbData).eq('id', id).select();
  if (error) throw error;
  return data[0];
}
