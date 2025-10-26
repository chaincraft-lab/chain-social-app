import {
  Typography,
  Box,
  Card,
  Container,
  Grid,
  CardContent,
  CardHeader,
  styled,
  Alert,
  CircularProgress
} from '@mui/material';
import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import dashboardService, { DashboardStats } from 'src/services/dashboard/DashboardService';

import Head from 'next/head';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';

const StatsCard = styled(Card)(
  ({ theme }) => `
    text-align: center;
    padding: ${theme.spacing(2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .MuiCardContent-root {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: ${theme.spacing(3)} !important;
    }
    
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Dashboard stats fetch error:', err);
        setError('An error occurred while loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - ChainSocial Admin</title>
      </Head>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Grid container spacing={3} alignItems="stretch">
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent>
                <ArticleTwoToneIcon className="stats-icon" color="primary" />
                <Typography variant="h3" className="stats-number" color="primary">
                  {stats.totalArticles}
                </Typography>
                <Typography className="stats-label">
                  Total Articles
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Today: +{stats.todayStats.articlesCreated}
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
                  Categories
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
                  Users
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Today: +{stats.todayStats.newUsers}
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
                  Pending Comments
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Today: +{stats.todayStats.commentsReceived}
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Recent Articles" />
              <CardContent>
                <Box>
                  {stats.recentArticles.length > 0 ? (
                    stats.recentArticles.map((article) => (
                      <Typography key={article.id} variant="body2" sx={{ mb: 1 }}>
                        • {article.title}
                        <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          ({new Date(article.createdAt).toLocaleDateString('tr-TR')})
                        </Typography>
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No articles yet
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Today's Summary" />
              <CardContent>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • {stats.todayStats.articlesCreated} new articles created
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • {stats.pendingComments} comments awaiting moderation
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • {stats.todayStats.newUsers} new user registrations
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • {stats.todayStats.commentsReceived} new comments received
                  </Typography>
                  <Typography variant="body2">
                    • Total {stats.totalCategories} categories available
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
