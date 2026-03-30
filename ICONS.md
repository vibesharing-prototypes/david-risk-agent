# Icon management

Icons live in `icons/` as individual SVG files. A Python script keeps everything in sync — you never need to edit `index.html` or `sprite.svg` by hand.

---

## How it works

```
icons/
  identification.svg   ← source files (edit these)
  assessment.svg
  ...
  sprite.svg           ← auto-generated, do not edit
```

The script reads every `.svg` in `icons/`, regenerates `sprite.svg`, and hot-swaps the embedded sprite block inside `index.html`. One command, both files stay in sync.

---

## Add a new icon

1. Export a 24×24 SVG from Figma (or any tool). Make sure paths use `fill="currentColor"` so CSS colour tokens apply.

2. Run:
   ```bash
   python3 scripts/update-icons.py add <name> <path/to/file.svg>
   ```
   Example:
   ```bash
   python3 scripts/update-icons.py add risk-owner ~/Downloads/risk-owner.svg
   ```
   This copies the file to `icons/risk-owner.svg` and rebuilds the sprite.

3. Use it in `index.html`:
   ```html
   <svg width="24" height="24" aria-hidden="true">
     <use href="#icon-risk-owner"/>
   </svg>
   ```

---

## Update an existing icon

1. Replace the file in `icons/` with the new version (same filename).

2. Rebuild:
   ```bash
   python3 scripts/update-icons.py
   ```

---

## Remove an icon

1. Delete the `.svg` file from `icons/` in Finder or Terminal.

2. Rebuild:
   ```bash
   python3 scripts/update-icons.py
   ```

3. Remove any `<use href="#icon-<name>"/>` references from `index.html` manually.

---

## List current icons

```bash
python3 scripts/update-icons.py list
```

---

## Icon naming rules

| Rule | Example |
|------|---------|
| Filename uses lowercase and hyphens | `risk-owner.svg` |
| Icon id = `icon-` + filename stem | `icon-risk-owner` |
| Paths must use `fill="currentColor"` | inherits muted / active colour from CSS |
| ViewBox should be `0 0 24 24` | matches the design system grid |

---

## Exporting from Figma

1. Select the icon frame (24×24).
2. In the right panel → **Export** → format **SVG**.
3. Check **Include "id" attribute** is off (keeps the file clean).
4. Export, then run the `add` command above.

---

## Troubleshooting

**Icon appears black / ignores theme colours**
→ Check that the SVG paths use `fill="currentColor"`, not a hardcoded hex value.

**Script says "Sentinel markers not found"**
→ The `<!-- SPRITE-START -->` / `<!-- SPRITE-END -->` comments were removed from `index.html`. Re-add them around the `<svg … style="display:none">` sprite block.

**`git status` shows `sprite.svg` always modified**
→ This is normal if you edited a source icon and haven't rebuilt yet. Run `python3 scripts/update-icons.py` to resync.
