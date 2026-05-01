import json

with open('zone.json', encoding='utf-16') as f:
    d = json.load(f)

for r in d['cpanelresult']['data'][0]['record']:
    name = r.get('name')
    if name in ['ai.conexao.ao.', 'api.conexao.ao.', 'admin.conexao.ao.', 'www.ai.conexao.ao.', 'www.api.conexao.ao.', 'www.admin.conexao.ao.']:
        print(f"Name: {name}, Line: {r.get('line')}, Type: {r.get('type')}")
