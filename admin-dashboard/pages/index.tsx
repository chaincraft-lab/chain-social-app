import {
  Typography,
  Box,
  Card,
  Container,
  Grid,
  CardContent,
  CardHeader,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Head from 'next/head';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';

const StatsCard = styled(Card)(
  ({ theme }) => `
    text-align: center;
    padding: ${theme.spacing(2)};
    
    .stats-icon {
      font-size: 3rem;
      margin-bottom: ${theme.spacing(1)};
    }
    
    .stats-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: ${theme.spacing(0.5)};
    }
    
    .stats-label {
      color: ${theme.palette.text.secondary};
      font-size: 0.875rem;
    }
`
);

function Dashboard() {
  // Dummy data - replace with actual API calls
  const stats = {
    totalArticles: 127,
    totalCategories: 8,
    totalUsers: 45,
    pendingComments: 12
  };

  return (
    <>
      <Head>
        <title>Dashboard - Haber Sitesi Admin</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Dashboard"
          subHeading="Haber sitenizin genel durumunu takip edin"
          docs="https://example.com"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent>
                <ArticleTwoToneIcon className="stats-icon" color="primary" />
                <Typography variant="h3" className="stats-number" color="primary">
                  {stats.totalArticles}
                </Typography>
                <Typography className="stats-label">
                  Toplam Makale
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent>
                <CategoryTwoToneIcon className="stats-icon" color="secondary" />
                <Typography variant="h3" className="stats-number" color="secondary">
                  {stats.totalCategories}
                </Typography>
                <Typography className="stats-label">
                  Kategori
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent>
                <PeopleTwoToneIcon className="stats-icon" color="success" />
                <Typography variant="h3" className="stats-number" color="success.main">
                  {stats.totalUsers}
                </Typography>
                <Typography className="stats-label">
                  Kullanıcı
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent>
                <CommentTwoToneIcon className="stats-icon" color="warning" />
                <Typography variant="h3" className="stats-number" color="warning.main">
                  {stats.pendingComments}
                </Typography>
                <Typography className="stats-label">
                  Bekleyen Yorum
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Son Makaleler" />
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Teknoloji Dünyasındaki Son Gelişmeler
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Yapay Zeka ve Gelecek
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Sporda Bu Hafta
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Ekonomik Gündem
                  </Typography>
                  <Typography variant="body2">
                    • Sağlık Haberleri
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Bekleyen İşlemler" />
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 5 makale onay bekliyor
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 12 yorum modere edilmeyi bekliyor
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 3 yeni kullanıcı kaydı
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • 2 spam raporu
                  </Typography>
                  <Typography variant="body2">
                    • 1 kategori güncelleme talebi
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
