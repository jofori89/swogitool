SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Faction](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Faction] ON 

INSERT [dbo].[Faction] ([Id], [Name]) VALUES (1, N'academy')
INSERT [dbo].[Faction] ([Id], [Name]) VALUES (2, N'crux')
INSERT [dbo].[Faction] ([Id], [Name]) VALUES (3, N'darklore')
INSERT [dbo].[Faction] ([Id], [Name]) VALUES (4, N'empire')
INSERT [dbo].[Faction] ([Id], [Name]) VALUES (5, N'sg')
INSERT [dbo].[Faction] ([Id], [Name]) VALUES (6, N'vita')
SET IDENTITY_INSERT [dbo].[Faction] OFF
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Faction] ADD UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
