// Curación a mano de qué perfiles reales de XPEAK se muestran como "esto
// podría encajar" en las guías de la Healthy Zone. NO es un query automático:
// se decidió a mano el 24 sep 2026 (excluir Marc Sanchis, camarero de Palma;
// excluir DJs predominantemente techno/hard techno/trance/hardstyle/
// hardcore — no pegan con tardeo/afterwork). Los DJs sin género declarado se
// incluyen igualmente.
//
// Cada rol lista varios user_id para rotar (evita que salga siempre el mismo
// perfil, sobre todo en catering y bailarín, donde solo hay 1-2 candidatos).
// Actualizar esta lista si se dan de alta perfiles nuevos con foto.

export type HZMatchRole = 'dj' | 'staff' | 'catering' | 'grupo-musical' | 'bailarin';

// user_id de perfiles con foto, aptos para recomendar en la Healthy Zone.
export const HZ_MATCH_IDS: Record<HZMatchRole, string[]> = {
  dj: [
    '9a0c9171-49a4-4873-81b6-6062778771b2', // DJ Geliux — reggaetón/comercial/tech house
    '2c8a5977-0516-4f01-97ad-a9d89f887644', // Andreww.madd — house/comercial
    'b0f68f18-cc6d-45d8-8fd5-f2d1d3ec884a', // Twodeck — tech house/deep house
    'a76fc58b-fc23-48ce-a189-87ac0cbfbf14', // Marcos Rivera — tech house/deep house
    '21c61d8b-a892-41ff-82e8-1d5cfef83413', // deejayantuan — comercial/hits
    '7ee6d4f2-916b-4b52-bd14-d9d250a75bac', // Borja.Madd — house
    '9c94a53b-0532-45ac-af69-488329a5d73f', // RUBEN TRIAS — house/deep house
    'ffcb5d2c-4d59-48e1-8e44-eaab5a852a7b', // Dj Poly — comercial/pop dance
    '8570ba10-5e38-4a4a-a934-849bbe30924b', // Daniel Torrez — tech house
    'c2fc41eb-628d-4db5-b307-b7b5d1ae10e0', // Dj Mege — comercial
    '27299211-5d4f-48c6-9c85-b205c605e256', // Gonzalo DJ — comercial/pop dance
    '28240c0a-b094-42ee-ae9f-f0bdd2cddf3c', // Manuel Jesús Frias Martín — sin género declarado
    '2e7752ca-a78c-4b25-80c2-d42c24f99f60', // Djmariobpm — sin género declarado
    'b82469d4-fcdd-4410-b100-1f8d4e30597f', // DJ Rick.Art — sin género declarado
    '2ea7ca05-12da-4322-ac51-6cb53940cf97', // DJ.Garvil — sin género declarado
    'd888bf46-8421-4eb1-acb2-a8697224c4dc', // Manuel Pérez — sin género declarado
    'fe6d0cdc-938f-45df-b3b1-55dd87c1b1f8', // DjTrejianix — sin género declarado
    'f6ca257b-237b-4ad9-91bd-11dae9e3283e', // jonny — sin género declarado
    '1d69aaa6-2ddd-4665-bf5d-70798e8514a3', // Sairo — sin género declarado
  ],
  staff: [
    'ef80d53f-7d63-4217-b078-58f26f7845a1', // Samuel — Zaragoza
    'd9693e98-b245-499b-9e08-0da9dafb84eb', // Juncal — Barcelona
    '11d05395-faa1-447e-9161-07da83c4a401', // Sofía Martín Blanco — Madrid
    'a19026c9-1001-4a75-89cf-f4cb9aad00f8', // Aitana López Montealegre — Madrid
    // Marc Sanchis (Palma) excluido a mano — no subirlo.
  ],
  catering: [
    'dbecdc2d-dd4f-4245-b87d-bd753a8443ce', // Daniela catering — Madrid
    '92f7a533-72fe-429e-83b4-75b551624e0c', // Vulcano Grill — Madrid
  ],
  'grupo-musical': [
    'e9666a2b-f314-4eb7-9b3c-44ae872596f2', // Soniché — Alicante
    'ee3f4ba4-01ed-4004-b75e-ee64761cb3bf', // Aurora Timón — Alicante
    '3302cc8f-27e3-4d55-89fb-62c5f4eb47f3', // 7Motivos — Pontevedra
    'bdf42275-a6d0-44cb-9812-20a367238d63', // Unfrontier — Madrid
    '57d3fca1-af55-4a9e-b262-efc87eca854c', // Juan Miguel Pina — Madrid
    'e21c4ede-45ff-4406-8ac5-76821a42a80a', // Marlene Grupo de Versiones — Murcia
  ],
  bailarin: [
    '1c9ef05a-e930-4840-8833-08d4565d14a2', // Mariane — Madrid (único con foto)
  ],
};

// Qué roles de "esto podría encajar" se muestran en cada guía, en orden.
export const HZ_MATCH_ROLES: Record<string, HZMatchRole[]> = {
  '/blog/tardeo-privado-madrid': ['dj', 'staff', 'grupo-musical'],
  '/blog/afterwork-empresa-madrid': ['dj', 'staff', 'catering'],
  '/blog/eventos-sin-alcohol': ['staff', 'dj'],
  '/blog/jornada-bienestar-empresa': ['grupo-musical', 'catering'],
};
