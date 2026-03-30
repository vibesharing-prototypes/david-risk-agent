# Atlas Design System — CSS Token Reference

All tokens are defined as CSS custom properties on `:root` in `css/styles.css`.

## Colour primitives

```
--storm-5   #0A1020    --sky-5    #00131E
--storm-10  #151B2C    --sky-15   #00293C
--storm-15  #1F2536    --sky-70   #00B7FC
--storm-20  #2A3041    --sky-80   #83CFFF
--storm-25  #353B4D    --sky-90   #C6E7FF
--storm-30  #404659    --sky-95   #E4F3FF
--storm-35  #4C5265
--storm-40  #585E71    --red-60   #FF5450
--storm-50  #71768B    --red-70   #FF8981
--storm-60  #8A90A5    --moss-60  #00A661
--storm-70  #A5ABC0    --yellow-80 #DEC800
--storm-80  #C0C6DC    --flamingo-60 #F45695
--storm-90  #DCE2F9    --indigo-60 #6B89FF
--storm-95  #EEF0FF    --indigo-70 #92A6FF
--storm-98  #FAF8FF
--storm-99  #FEFBFF    --color-white #FFFFFF
```

## Semantic colours

### Type (text)
```
--color-type-default    #FFFFFF   Primary text
--color-type-muted      #8A90A5   Secondary / caption text
--color-type-disabled   #71768B   Disabled / placeholder text
```

### Actions
```
--color-action-primary-default              #00B7FC   Buttons, links
--color-action-primary-on-primary           #00293C   Text on primary buttons
--color-action-primary-disabled             #4C5265
--color-action-secondary-hover              #2A3041   Hover background
--color-action-secondary-active             #71768B
--color-action-secondary-on-secondary       #FFFFFF
```

### Selection
```
--color-selection-primary-default           #353B4D   Selected row / item bg
--color-selection-primary-hover             #2A3041
--color-selection-primary-on-selected       #00B7FC   Text on selected
--color-selection-primary-indicator         #00B7FC   Active indicator bar
```

### Surfaces
```
--color-background-base             #1F2536   Panel background
--color-surface-default             #1F2536
--color-surface-variant             #353B4D   Card background
--color-surface-variant-subtle      #2A3041   Subtle card / hover bg
```

### Outlines
```
--color-outline-static    #404659   Subtle borders
--color-outline-default   #71768B   Standard borders
--color-outline-hover     #A5ABC0   Hover borders
--color-outline-active    #FFFFFF   Active / focus borders
--color-outline-disabled  #4C5265
```

### Dividers
```
--color-ui-divider-default      #4C5265
--color-ui-divider-secondary    #8A90A5
```

### Status
```
--color-status-success-default      #00A661   Green
--color-status-success-background   #004525   Green bg
--color-status-success-content      #C2FFD2   Green text on bg

--color-status-warning-default      #DEC800   Yellow
--color-status-warning-background   #443C00
--color-status-warning-content      #FFF2AA

--color-status-error-default        #FF5450   Red
--color-status-error-background     #540006

--color-status-notification-default    #83CFFF
--color-status-notification-background #00405B

--color-status-neutral-background-default  #8A90A5
--color-status-neutral-background-variant  #404659
--color-status-neutral-content-variant     #C0C6DC
```

### AI accent gradient
```
--color-ai-grad-start    #FF8981
--color-ai-grad-middle   #DB8BFF
--color-ai-grad-end      #92A6FF
```

## Spacing

```
--space-0     0px
--space-px    1px
--space-0-25  2px
--space-0-5   4px
--space-1     8px
--space-1-5   12px
--space-2     16px
--space-2-5   20px
--space-3     24px
--space-4     32px
--space-4-5   36px
--space-5     40px
--space-6     48px
--space-7     56px
```

## Typography

All styles use `font-family: 'Plus Jakarta Sans'`.

| Style | Size var | Line-height var | Weight var | Letter-spacing var |
|-------|----------|-----------------|------------|--------------------|
| H1 | `--type-title-h1-size` (28px) | `--type-title-h1-line-height` (34px) | `--type-title-h1-weight` (400) | `--type-title-h1-letter-spacing` (0) |
| H2 | `--type-title-h2-size` (24px) | `--type-title-h2-line-height` (30px) | `--type-title-h2-weight` (400) | `--type-title-h2-letter-spacing` (0) |
| H3 Lg | `--type-title-h3-lg-size` (20px) | `--type-title-h3-lg-line-height` (24px) | `--type-title-h3-lg-weight` (400) | `--type-title-h3-lg-letter-spacing` (0) |
| Body | `--type-text-body-size` (14px) | `--type-text-body-line-height` (20px) | `--type-text-body-weight` (400) | `--type-text-body-letter-spacing` (0.2px) |
| Md | `--type-text-md-size` (12px) | `--type-text-md-line-height` (16px) | `--type-text-md-weight` (400) | `--type-text-md-letter-spacing` (0.3px) |
| Sm | `--type-text-sm-size` (10px) | `--type-text-sm-line-height` (12px) | `--type-text-sm-weight` (400) | `--type-text-sm-letter-spacing` (0.3px) |

Emphasis variants use weight `600` via `--type-text-{scale}-emphasis-weight`.

## Layout tokens

```
--topbar-height   var(--space-7)   56px
--panel-gap       var(--space-1)   8px
--panel-radius    var(--space-1)   8px
--sidebar-width   244px
```
