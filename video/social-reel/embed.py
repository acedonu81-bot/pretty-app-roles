import base64

TOKENS = {
    '__PHOTO_DJ__':          'photos/dj.jpg',
    '__PHOTO_FOTOGRAFIA__':  'photos/fotografia.jpg',
    '__PHOTO_MAQUILLAJE__':  'photos/maquillaje.jpg',
    '__PHOTO_STAFF__':       'photos/staff.jpg',
    '__PHOTO_CATERING__':    'photos/catering.jpg',
    '__PHOTO_VESTUARIO__':   'photos/vestuario.jpg',
    '__PHOTO_MEDIA__':       'photos/media.jpg',
}

with open('index.template.html', 'r') as f:
    html = f.read()

for token, path in TOKENS.items():
    with open(path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    data_uri = f'data:image/jpeg;base64,{b64}'
    html = html.replace(token, data_uri)
    print(f'  ✓ {token} → {len(data_uri)//1024}KB')

with open('index.html', 'w') as f:
    f.write(html)

print(f'\nindex.html generado — {len(html)//1024}KB total')
