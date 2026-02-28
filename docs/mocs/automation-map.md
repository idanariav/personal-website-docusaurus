---
tags: []
UUID: 20220715063867
Created: '2022-07-15 06:38'
Modified: '2023-06-26 19:59'
Version: 1
Up: '[[Technology (MOC)]]'
draft: true
SiteProcssed: true
---

# Automation MOC

## Notes

```dataview
LIST FROM [Automation (MOC)](/mocs/automation-moc.md) AND -outgoing([Automation (MOC)](/mocs/automation-moc.md))
AND  !#Type/MOC AND !#review/Daily
sort file.name asc
```

### APi
[API](/notes/api.md) - a way for softwares to communicate with one another and exchange information. For us it's a way to create automation between two or more apps. Some companies that offer such a service:

- integromat
- zapier
- ifttt
- automate.io

### Templates
```dataview
LIST FROM "Extras/Templates"
```

## Other MOC

[Technology (MOC)](/mocs/technology-moc.md)

