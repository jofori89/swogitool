SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rarity](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Grade] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Rarity] ON 

INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (1, N'Common')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (4, N'D.Rare')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (6, N'Event')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (7, N'Imperial')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (8, N'Prize')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (3, N'Rare')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (5, N'T.Rare')
INSERT [dbo].[Rarity] ([Id], [Grade]) VALUES (2, N'Uncommon')
SET IDENTITY_INSERT [dbo].[Rarity] OFF
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Rarity] ADD UNIQUE NONCLUSTERED 
(
	[Grade] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
