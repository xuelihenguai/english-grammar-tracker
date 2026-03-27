import { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = 'https://tmlkbvufizyfbwyvukvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbGtidnVmaXp5ZmJ3eXZ1a3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODk1NjIsImV4cCI6MjA4OTk2NTU2Mn0.zSgzNREVXAdhmj-s8Mz8xTxgELGfLe0RoSFe623HcNI';

// 确保API密钥存在
if (!supabaseKey) {
  console.error('Supabase API key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// 类型定义
interface User {
  id: string;
  username: string;
}

interface GrammarType {
  id: string;
  name: string;
  level: string;
  total_questions: number;
  sort_order: number;
  created_at: string;
}

interface StudyRecord {
  id: string;
  user_id: string;
  grammar_type_id: string;
  date: string;
  completed_questions: number;
  created_at: string;
}

interface GrammarWithProgress {
  id: string;
  name: string;
  level: string;
  total_questions: number;
  completed_questions: number;
  progress: number;
  today_completed: number;
}

function App() {
  // 状态管理
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // 应用状态
  const [currentLevel, setCurrentLevel] = useState<string>('初中');
  const [currentFunction, setCurrentFunction] = useState<string>('记录刷题');
  const [grammarTypes, setGrammarTypes] = useState<GrammarType[]>([]);
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [selectedGrammarType, setSelectedGrammarType] = useState<string>('');
  const [grammarInput, setGrammarInput] = useState<string>('');
  const [completedQuestions, setCompletedQuestions] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  
  // 成功提示弹窗状态
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // 下拉框状态
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  
  // 题目配置状态
  const [newGrammarName, setNewGrammarName] = useState<string>('');
  const [newGrammarLevel, setNewGrammarLevel] = useState<string>('初中');
  const [newGrammarQuestions, setNewGrammarQuestions] = useState<number>(100);
  const [newGrammarSort, setNewGrammarSort] = useState<number>(0);
  
  // 状态管理
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // 登录逻辑
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      // 检查用户是否存在
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);
      
      if (error) {
        throw error;
      }
      
      if (users && users.length > 0) {
        setUser(users[0]);
      } else {
        setLoginError('用户名或密码错误');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('登录失败，请稍后重试');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // 注册逻辑
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setRegisterError('');
    
    if (password !== confirmPassword) {
      setRegisterError('两次输入的密码不一致');
      setIsLoggingIn(false);
      return;
    }
    
    try {
      // 检查用户名是否已存在
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingUsers.length > 0) {
        setRegisterError('用户名已存在');
        setIsLoggingIn(false);
        return;
      }
      
      // 创建新用户
      const { error } = await supabase
        .from('users')
        .insert({
          username,
          password
        });
      
      if (error) {
        throw error;
      }
      
      // 自动登录
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);
      
      if (users && users.length > 0) {
        setUser(users[0]);
      }
    } catch (error) {
      console.error('Register error:', error);
      setRegisterError('注册失败，请稍后重试');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // 登出逻辑
  const handleLogout = () => {
    setUser(null);
  };
  
  // 显示成功提示弹窗
  const showSuccessAlert = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    // 两秒后自动消失
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };
  
  // 获取语法类型
  const fetchGrammarTypes = async () => {
    try {
      let query = supabase
        .from('grammar_types')
        .select('*');
      
      // 在题目配置页面时获取所有学段的语法类型
      if (currentFunction !== '题目配置') {
        query = query.eq('level', currentLevel);
      }
      
      const { data, error } = await query.order('sort_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setGrammarTypes(data || []);
    } catch (error) {
      console.error('Error fetching grammar types:', error);
    }
  };
  
  // 获取学习记录
  const fetchStudyRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('study_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setStudyRecords(data || []);
    } catch (error) {
      console.error('Error fetching study records:', error);
    }
  };
  
  // 当级别、功能或用户变化时，重新获取数据
  useEffect(() => {
    if (user) {
      fetchGrammarTypes();
      fetchStudyRecords();
    }
  }, [currentLevel, currentFunction, user]);
  
  // 处理级别切换
  const handleLevelChange = (level: string) => {
    setCurrentLevel(level);
  };
  
  // 处理功能切换
  const handleFunctionChange = (func: string) => {
    setCurrentFunction(func);
  };
  
  // 计算语法类型的进度
  const calculateGrammarProgress = (grammarId: string): GrammarWithProgress | null => {
    const grammar = grammarTypes.find(g => g.id === grammarId);
    if (!grammar) return null;
    
    const records = studyRecords.filter(r => r.grammar_type_id === grammarId);
    const totalCompleted = records.reduce((sum, record) => sum + record.completed_questions, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(r => r.date === today);
    const todayCompleted = todayRecord ? todayRecord.completed_questions : 0;
    const progress = grammar.total_questions > 0 ? (totalCompleted / grammar.total_questions) * 100 : 0;
    
    return {
      id: grammar.id,
      name: grammar.name,
      level: grammar.level,
      total_questions: grammar.total_questions,
      completed_questions: totalCompleted,
      progress,
      today_completed: todayCompleted
    };
  };
  
  // 添加学习记录
  const handleAddRecord = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    
    if (!selectedGrammarType) {
      alert('请选择语法类型');
      return;
    }
    
    if (completedQuestions <= 0) {
      alert('请输入有效的完成题数');
      return;
    }
    
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      if (selectedGrammarType === 'all') {
        // 为所有语法类型添加记录
        for (const grammar of grammarTypes) {
          // 检查是否已有今天的记录
          const { data: existingRecord, error: checkError } = await supabase
            .from('study_records')
            .select('*')
            .eq('user_id', user.id)
            .eq('grammar_type_id', grammar.id)
            .eq('date', today)
            .single();
          
          if (checkError && checkError.code !== 'PGRST116') {
            console.error('检查现有记录失败:', checkError);
            throw checkError;
          }
          
          if (existingRecord) {
            // 更新现有记录
            const { error: updateError } = await supabase
              .from('study_records')
              .update({ completed_questions: existingRecord.completed_questions + completedQuestions })
              .eq('id', existingRecord.id);
            
            if (updateError) {
              console.error('更新记录失败:', updateError);
              throw updateError;
            }
          } else {
            // 创建新记录
            const { error: insertError } = await supabase
              .from('study_records')
              .insert({
                user_id: user.id,
                grammar_type_id: grammar.id,
                date: today,
                completed_questions: completedQuestions
              });
            
            if (insertError) {
              console.error('创建记录失败:', insertError);
              throw insertError;
            }
          }
        }
      } else {
        let grammarTypeId = selectedGrammarType;
        
        // 处理手动输入的语法类型
        if (selectedGrammarType === 'temp') {
          // 检查是否已经存在同名的语法类型
          const { data: existingGrammar, error: checkError } = await supabase
            .from('grammar_types')
            .select('*')
            .eq('name', grammarInput)
            .eq('level', currentLevel)
            .single();
          
          if (checkError && checkError.code !== 'PGRST116') {
            console.error('检查语法类型失败:', checkError);
            throw checkError;
          }
          
          if (existingGrammar) {
            // 使用现有的语法类型
            grammarTypeId = existingGrammar.id;
          } else {
            // 创建新的语法类型
            const { data: newGrammar, error: insertError } = await supabase
              .from('grammar_types')
              .insert({
                name: grammarInput,
                level: currentLevel,
                total_questions: 0,
                sort_order: 9999 // 设置一个较大的排序值
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('创建语法类型失败:', insertError);
              throw insertError;
            }
            
            grammarTypeId = newGrammar.id;
            // 重新获取语法类型列表
            await fetchGrammarTypes();
          }
        }
        
        console.log('添加记录参数:', {
          user_id: user.id,
          grammar_type_id: grammarTypeId,
          date: today,
          completed_questions: completedQuestions
        });
        
        // 检查是否已有今天的记录
        const { data: existingRecord, error: checkError } = await supabase
          .from('study_records')
          .select('*')
          .eq('user_id', user.id)
          .eq('grammar_type_id', grammarTypeId)
          .eq('date', today)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error('检查现有记录失败:', checkError);
          throw checkError;
        }
        
        if (existingRecord) {
          // 更新现有记录
          const { error: updateError } = await supabase
            .from('study_records')
            .update({ completed_questions: existingRecord.completed_questions + completedQuestions })
            .eq('id', existingRecord.id);
          
          if (updateError) {
            console.error('更新记录失败:', updateError);
            throw updateError;
          }
        } else {
          // 创建新记录
          const { error: insertError } = await supabase
            .from('study_records')
            .insert({
              user_id: user.id,
              grammar_type_id: grammarTypeId,
              date: today,
              completed_questions: completedQuestions
            });
          
          if (insertError) {
            console.error('创建记录失败:', insertError);
            throw insertError;
          }
        }
      }
      
      // 重新获取记录
      await fetchStudyRecords();
      // 重置表单
      setCompletedQuestions(30); // 重置为默认值30
      setSelectedGrammarType('');
      setGrammarInput('');
      setShowDropdown(false);
      showSuccessAlert('添加记录成功！');
    } catch (error) {
      console.error('添加记录失败:', error);
      alert('添加记录失败，请稍后重试\n错误信息: ' + JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 添加语法类型
  const handleAddGrammarType = async () => {
    if (!newGrammarName) return;
    
    try {
      setIsLoading(true);
      
      // 计算排序值
      let sortOrder = newGrammarSort;
      if (sortOrder === 0) {
        // 如果未设置排序值，按照所属学段的最大排序值加1
        const { data: existingGrammarTypes, error: fetchError } = await supabase
          .from('grammar_types')
          .select('sort_order')
          .eq('level', newGrammarLevel)
          .order('sort_order', { ascending: false })
          .limit(1);
        
        if (!fetchError && existingGrammarTypes && existingGrammarTypes.length > 0) {
          sortOrder = existingGrammarTypes[0].sort_order + 1;
        } else {
          // 如果该学段还没有语法类型，从1开始
          sortOrder = 1;
        }
      }
      
      await supabase
        .from('grammar_types')
        .insert({
          name: newGrammarName,
          level: newGrammarLevel,
          total_questions: newGrammarQuestions,
          sort_order: sortOrder
        });
      
      // 重新获取语法类型
      await fetchGrammarTypes();
      // 重置表单
      setNewGrammarName('');
      setNewGrammarQuestions(100);
      setNewGrammarSort(0);
      showSuccessAlert('添加语法类型成功！');
    } catch (error) {
      console.error('Error adding grammar type:', error);
      alert('添加语法类型失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 删除语法类型
  const handleDeleteGrammarType = async (id: string) => {
    if (!confirm('确定要删除这个语法类型吗？')) return;
    
    try {
      setIsLoading(true);
      await supabase
        .from('grammar_types')
        .delete()
        .eq('id', id);
      
      // 重新获取语法类型
      await fetchGrammarTypes();
    } catch (error) {
      console.error('Error deleting grammar type:', error);
      alert('删除语法类型失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 导出模板
  const handleExportTemplate = () => {
    // 创建CSV内容
    const csvContent = [
      ['语法名称', '学段', '总题数', '排序'],
      ['示例：动词时态', '初中', '100', '1'],
      ['示例：名词', '高中', '150', '2']
    ];
    
    // 转换为CSV字符串
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    
    // 创建Blob对象
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'grammar_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 批量导入
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      setUploadProgress(0);
      setUploadStatus('正在读取文件...');
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const grammarTypesToAdd = [];
        
        // 跳过表头
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const [name, level, total_questions, sort_order] = line.split(',');
          if (name && level && total_questions && sort_order) {
            grammarTypesToAdd.push({
              name: name.trim(),
              level: level.trim(),
              total_questions: parseInt(total_questions.trim()),
              sort_order: parseInt(sort_order.trim())
            });
          }
        }
        
        setUploadStatus('正在导入数据...');
        
        // 批量插入
        for (let i = 0; i < grammarTypesToAdd.length; i++) {
          const grammar = grammarTypesToAdd[i];
          await supabase
            .from('grammar_types')
            .upsert(grammar, { onConflict: 'id' });
          
          // 更新进度
          const progress = Math.round(((i + 1) / grammarTypesToAdd.length) * 100);
          setUploadProgress(progress);
        }
        
        // 重新获取语法类型
      await fetchGrammarTypes();
      const successMsg = `成功导入 ${grammarTypesToAdd.length} 条语法类型`;
      setUploadStatus(successMsg);
      showSuccessAlert(successMsg);
      
      // 3秒后清除状态
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('');
      }, 3000);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing grammar types:', error);
      setUploadStatus('导入失败，请稍后重试');
      // 3秒后清除状态
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('');
      }, 3000);
    } finally {
      setIsLoading(false);
      // 重置文件输入
      e.target.value = '';
    }
  };
  
  // 处理排序
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // 如果点击的是当前排序列，则切换排序方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 否则，设置新的排序列和默认排序方向
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // 登录页面
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>语法学习进度跟踪系统</h1>
          {!isRegistering ? (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && <div className="error-message">{loginError}</div>}
              <button type="submit" className="login-button" disabled={isLoggingIn}>
                {isLoggingIn ? '登录中...' : '登录'}
              </button>
              <div className="login-footer">
                <span>还没有账号？</span>
                <button type="button" className="register-link" onClick={() => setIsRegistering(true)}>
                  立即注册
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">确认密码</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              {registerError && <div className="error-message">{registerError}</div>}
              <button type="submit" className="login-button" disabled={isLoggingIn}>
                {isLoggingIn ? '注册中...' : '注册'}
              </button>
              <div className="login-footer">
                <span>已有账号？</span>
                <button type="button" className="register-link" onClick={() => setIsRegistering(false)}>
                  立即登录
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
  
  // 主应用页面
  return (
    <div className="app-container">
      {/* 成功提示弹窗 */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '600',
          animation: 'fadeIn 0.3s ease'
        }}>
          {successMessage}
        </div>
      )}
      <header className="app-header">
        <h1>语法学习进度跟踪系统</h1>
        <div className="user-info">
          <span>欢迎, {user.username}</span>
          <span className="login-time">登录时间: {new Date().toLocaleTimeString()}</span>
          <button className="logout-button" onClick={handleLogout}>退出</button>
        </div>
      </header>
      <div className="app-layout">
        <aside className="sidebar">
          <nav className="navigation">
            <div className="nav-section">
              <h3>主导航</h3>
              <ul>
                <li>
                  <button 
                    className={`nav-item ${currentFunction !== '题目配置' ? 'active' : ''}`}
                    onClick={() => setCurrentFunction('记录刷题')}
                  >
                    学习管理
                  </button>
                  <ul className="sub-nav">
                    <li>
                      <button 
                        className={`sub-nav-item ${currentLevel === '初中' ? 'active primary' : ''}`}
                        onClick={() => {
                          handleLevelChange('初中');
                          handleFunctionChange('记录刷题');
                        }}
                      >
                        初中语法
                      </button>
                      <ul className="sub-nav">
                        <li>
                          <button 
                            className={`sub-nav-item ${currentFunction === '记录刷题' && currentLevel === '初中' ? 'active' : ''}`}
                            onClick={() => {
                              handleLevelChange('初中');
                              handleFunctionChange('记录刷题');
                            }}
                          >
                            记录刷题
                          </button>
                        </li>
                        <li>
                          <button 
                            className={`sub-nav-item ${currentFunction === '进度统计' && currentLevel === '初中' ? 'active' : ''}`}
                            onClick={() => {
                              handleLevelChange('初中');
                              handleFunctionChange('进度统计');
                            }}
                          >
                            进度统计
                          </button>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <button 
                        className={`sub-nav-item ${currentLevel === '高中' ? 'active secondary' : ''}`}
                        onClick={() => {
                          handleLevelChange('高中');
                          handleFunctionChange('记录刷题');
                        }}
                      >
                        高中语法
                      </button>
                      <ul className="sub-nav">
                        <li>
                          <button 
                            className={`sub-nav-item ${currentFunction === '记录刷题' && currentLevel === '高中' ? 'active' : ''}`}
                            onClick={() => {
                              handleLevelChange('高中');
                              handleFunctionChange('记录刷题');
                            }}
                          >
                            记录刷题
                          </button>
                        </li>
                        <li>
                          <button 
                            className={`sub-nav-item ${currentFunction === '进度统计' && currentLevel === '高中' ? 'active' : ''}`}
                            onClick={() => {
                              handleLevelChange('高中');
                              handleFunctionChange('进度统计');
                            }}
                          >
                            进度统计
                          </button>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <button 
                    className={`nav-item ${currentFunction === '题目配置' ? 'active' : ''}`}
                    onClick={() => setCurrentFunction('题目配置')}
                  >
                    题目配置
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        <main className="main-content">
          <div className="content-area">
          {/* 记录刷题页面 */}
          {currentFunction === '记录刷题' && (
            <div className="practice-record">
              <h2>添加刷题记录</h2>
              {/* 学段汇总数据 */}
              <div className="level-summary" style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                padding: '16px',
                background: '#232323',
                border: '1px solid #333',
                borderRadius: '8px'
              }}>
                {(() => {
                  const totalQuestions = grammarTypes.reduce((sum, grammar) => sum + (grammar.total_questions || 0), 0);
                  const totalCompleted = grammarTypes.reduce((sum, grammar) => {
                    const progress = calculateGrammarProgress(grammar.id);
                    return sum + (progress ? progress.completed_questions : 0);
                  }, 0);
                  const totalProgress = totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;
                  
                  return (
                    <>
                      <div style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        background: '#2a2a2a',
                        borderRadius: '6px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ fontSize: '12px', color: '#a8a8a8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>总题目</div>
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>{totalQuestions}</div>
                      </div>
                      <div style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        background: '#2a2a2a',
                        borderRadius: '6px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ fontSize: '12px', color: '#a8a8a8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>总完成</div>
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>{totalCompleted}</div>
                      </div>
                      <div style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '12px',
                        background: '#2a2a2a',
                        borderRadius: '6px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ fontSize: '12px', color: '#a8a8a8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>总进度</div>
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>{totalProgress.toFixed(1)}%</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="record-form">
                <div style={{ position: 'relative', flex: 1 }}>
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      className="grammar-select"
                      placeholder="选择或输入语法类型"
                      value={grammarInput}
                      onChange={(e) => {
                        setGrammarInput(e.target.value);
                        // 当用户输入时，清除当前选择
                        setSelectedGrammarType('');
                      }}
                      onFocus={() => {
                        // 当输入框获得焦点时，显示下拉列表
                        setShowDropdown(true);
                      }}
                      onBlur={() => {
                        // 当输入框失去焦点时，延迟关闭下拉列表，以便点击选项时能够触发点击事件
                        setTimeout(() => {
                          setShowDropdown(false);
                        }, 200);
                      }}
                      style={{
                        width: '100%',
                        paddingRight: '30px',
                        zIndex: 1,
                        position: 'relative'
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        right: '10px',
                        zIndex: 2,
                        color: '#888',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setShowDropdown(!showDropdown);
                      }}
                    >
                      ▼
                    </div>
                  </div>
                  {showDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#232323',
                      border: '1px solid #333',
                      borderRadius: '0 0 6px 6px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                      {/* 添加全部选项 */}
                      <div
                        onClick={() => {
                          setSelectedGrammarType('all');
                          setGrammarInput('全部');
                          setShowDropdown(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #333',
                          fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2a2a2a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#232323';
                        }}
                      >
                        全部
                      </div>
                      {/* 显示过滤后的语法类型 */}
                      {grammarTypes
                        .filter(grammar => 
                          grammar.name.toLowerCase().includes(grammarInput.toLowerCase())
                        )
                        .map(grammar => (
                          <div
                            key={grammar.id}
                            onClick={() => {
                              setSelectedGrammarType(grammar.id);
                              setGrammarInput(`${grammar.name}${grammar.total_questions > 0 ? ` (${grammar.total_questions}题)` : ''}`);
                              setShowDropdown(false);
                            }}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #333'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#2a2a2a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#232323';
                            }}
                          >
                            {grammar.name}{grammar.total_questions > 0 ? ` (${grammar.total_questions}题)` : ''}
                          </div>
                        ))
                      }
                      {/* 显示手动输入的内容作为选项 */}
                      {grammarInput && !grammarTypes.some(grammar => 
                        grammar.name.toLowerCase() === grammarInput.toLowerCase()
                      ) && (
                        <div
                          onClick={() => {
                            // 当用户点击手动输入的内容时，创建一个临时的语法类型
                            setSelectedGrammarType('temp');
                            setShowDropdown(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #333',
                            color: '#10b981'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2a2a2a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#232323';
                          }}
                        >
                          手动输入: {grammarInput}
                        </div>
                      )}
                    </div>
                  )}
                  {!grammarInput && selectedGrammarType && selectedGrammarType !== 'temp' && selectedGrammarType !== 'all' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      {(() => {
                        const selectedGrammar = grammarTypes.find(g => g.id === selectedGrammarType);
                        if (!selectedGrammar) return '';
                        return selectedGrammar.name + (selectedGrammar.total_questions && selectedGrammar.total_questions > 0 ? ` (${selectedGrammar.total_questions}题)` : '');
                      })()}
                    </div>
                  )}
                </div>
                <input 
                  type="number" 
                  placeholder="完成题数" 
                  className="question-input"
                  value={completedQuestions}
                  onChange={(e) => setCompletedQuestions(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  min="1"
                  step="30"
                />
                <button 
                  className="add-record-button"
                  onClick={handleAddRecord}
                  disabled={isLoading || !selectedGrammarType || completedQuestions <= 0}
                >
                  {isLoading ? '添加中...' : '+ 添加记录'}
                </button>
              </div>
              {selectedGrammarType && (
                <div className="progress-summary">
                  {(() => {
                    const progress = calculateGrammarProgress(selectedGrammarType);
                    if (!progress) return null;
                    return (
                      <>
                        <div className="summary-item">
                          <span>总题数:</span>
                          <span>{progress.total_questions}</span>
                        </div>
                        <div className="summary-item">
                          <span>已完成:</span>
                          <span>{progress.completed_questions}</span>
                        </div>
                        <div className="summary-item">
                          <span>剩余:</span>
                          <span>{progress.total_questions - progress.completed_questions}</span>
                        </div>
                        <div className="summary-item">
                          <span>进度:</span>
                          <span>{progress.progress.toFixed(1)}%</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
              <div className="today-records">
                <h3>今日刷题记录</h3>
                {(() => {
                  const today = new Date().toISOString().split('T')[0];
                  const todayRecords = studyRecords.filter(r => r.date === today);
                  
                  if (todayRecords.length === 0) {
                    return (
                      <div className="empty-state">
                        <p>今日还没有刷题记录</p>
                        <p>快去完成一些题目吧！</p>
                      </div>
                    );
                  }
                  
                  return (
                    <table className="progress-table">
                      <thead>
                        <tr>
                          <th>语法类型</th>
                          <th>完成时间</th>
                          <th>完成题数</th>
                          <th>累计完成</th>
                          <th>进度</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayRecords.map(record => {
                          const grammar = grammarTypes.find(g => g.id === record.grammar_type_id);
                          const progress = calculateGrammarProgress(record.grammar_type_id);
                          if (!grammar || !progress) return null;
                          
                          return (
                            <tr key={record.id}>
                              <td>{grammar.name}</td>
                              <td>{new Date(record.created_at).toLocaleTimeString()}</td>
                              <td>{record.completed_questions}</td>
                              <td>{progress.completed_questions}</td>
                              <td>{progress.progress.toFixed(1)}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          )}
          
          {/* 进度统计页面 */}
          {currentFunction === '进度统计' && (
            <div className="progress-stats">
              <h2>进度统计</h2>
              <div className="progress-bar-container">
                {grammarTypes.map(grammar => {
                  const progress = calculateGrammarProgress(grammar.id);
                  if (!progress) return null;
                  
                  return (
                    <div key={grammar.id} className="progress-bar-item">
                      <div className="progress-bar-label">{grammar.name}</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(progress.progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-bar-percentage">{progress.progress.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
              <div className="detail-progress-list">
                <h3>详细进度列表</h3>
                <div className="pagination-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>第 {currentPage} 页，共 {Math.ceil(grammarTypes.length / pageSize)} 页</span>
                    <div>
                      <span>每页显示：</span>
                      <select 
                        value={pageSize} 
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                        style={{ marginLeft: '8px', padding: '4px', background: '#2a2a2a', border: '1px solid #333', borderRadius: '4px', color: '#e6e6e6' }}
                      >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                      </select>
                    </div>
                  </div>
                </div>
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('name')}
                      >
                        语法类型 {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('total_questions')}
                      >
                        总题数 {sortColumn === 'total_questions' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('completed_questions')}
                      >
                        已完成 {sortColumn === 'completed_questions' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>剩余</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('today_completed')}
                      >
                        今日完成 {sortColumn === 'today_completed' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('progress')}
                      >
                        进度 {sortColumn === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // 计算所有语法类型的进度
                      const grammarsWithProgress = grammarTypes.map(grammar => {
                        const progress = calculateGrammarProgress(grammar.id);
                        return progress;
                      }).filter((progress): progress is GrammarWithProgress => progress !== null);
                      
                      // 排序
                      let sortedGrammars = [...grammarsWithProgress];
                      if (sortColumn) {
                        sortedGrammars.sort((a, b) => {
                          let aValue = a[sortColumn as keyof GrammarWithProgress];
                          let bValue = b[sortColumn as keyof GrammarWithProgress];
                          
                          if (typeof aValue === 'string' && typeof bValue === 'string') {
                            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                          }
                          return 0;
                        });
                      }
                      
                      // 分页
                      const startIndex = (currentPage - 1) * pageSize;
                      const endIndex = startIndex + pageSize;
                      const paginatedGrammars = sortedGrammars.slice(startIndex, endIndex);
                      
                      return paginatedGrammars.map((progress, index) => (
                        <tr key={progress.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{progress.name}</td>
                          <td>{progress.total_questions > 0 ? progress.total_questions : ''}</td>
                          <td>{progress.completed_questions > 0 ? progress.completed_questions : ''}</td>
                          <td>{(progress.total_questions - progress.completed_questions) > 0 ? (progress.total_questions - progress.completed_questions) : ''}</td>
                          <td>{progress.today_completed}</td>
                          <td>{progress.progress.toFixed(1)}%</td>
                          <td>
                            <button className="modify-button">修改</button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ 
                      padding: '6px 12px', 
                      background: currentPage === 1 ? '#333' : '#2a2a2a', 
                      border: '1px solid #444', 
                      borderRadius: '4px', 
                      color: currentPage === 1 ? '#888' : '#e6e6e6', 
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    上一页
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(grammarTypes.length / pageSize)))}
                    disabled={currentPage >= Math.ceil(grammarTypes.length / pageSize)}
                    style={{ 
                      padding: '6px 12px', 
                      background: currentPage >= Math.ceil(grammarTypes.length / pageSize) ? '#333' : '#2a2a2a', 
                      border: '1px solid #444', 
                      borderRadius: '4px', 
                      color: currentPage >= Math.ceil(grammarTypes.length / pageSize) ? '#888' : '#e6e6e6', 
                      cursor: currentPage >= Math.ceil(grammarTypes.length / pageSize) ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 题目配置页面 */}
          {currentFunction === '题目配置' && (
            <div className="grammar-config">
              <h2>语法类型配置</h2>
              <div className="add-grammar-form">
                <input 
                  type="text" 
                  placeholder="如: 动词时态" 
                  className="grammar-name-input"
                  value={newGrammarName}
                  onChange={(e) => setNewGrammarName(e.target.value)}
                />
                <select 
                  className="grammar-level-select"
                  value={newGrammarLevel}
                  onChange={(e) => setNewGrammarLevel(e.target.value)}
                >
                  <option value="初中">初中</option>
                  <option value="高中">高中</option>
                </select>
                <input 
                  type="number" 
                  value={newGrammarQuestions}
                  onChange={(e) => setNewGrammarQuestions(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  className="grammar-questions-input"
                  min="0"
                />
                <input 
                  type="number" 
                  value={newGrammarSort}
                  onChange={(e) => setNewGrammarSort(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                  className="grammar-sort-input"
                  min="0"
                />
                <button 
                  className="add-grammar-button"
                  onClick={handleAddGrammarType}
                  disabled={isLoading || !newGrammarName}
                >
                  {isLoading ? '添加中...' : '+ 添加'}
                </button>
                <button className="import-export-button" onClick={() => handleExportTemplate()}>导出模板</button>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleImport} 
                  style={{ display: 'none' }} 
                  id="file-input"
                />
                <button className="import-export-button" onClick={() => document.getElementById('file-input')?.click()}>批量导入</button>
              </div>
              {uploadStatus && (
                <div className="upload-progress">
                  <div className="upload-status">{uploadStatus}</div>
                  {uploadProgress > 0 && (
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
              <div className="grammar-list">
                <h3>语法类型列表</h3>
                <div className="pagination-info">共 {grammarTypes.length} 条记录</div>
                <table className="grammar-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>语法名称</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('level')}
                      >
                        学段 {sortColumn === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>总题数</th>
                      <th>排序</th>
                      <th>创建时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grammarTypes.sort((a, b) => {
                      if (sortColumn === 'level') {
                        if (a.level === b.level) return 0;
                        return sortDirection === 'asc' ? (a.level === '初中' ? -1 : 1) : (a.level === '高中' ? -1 : 1);
                      }
                      return 0;
                    }).map((grammar, index) => (
                      <tr key={grammar.id}>
                        <td>{index + 1}</td>
                        <td>{grammar.name}</td>
                        <td>
                          <span className={`level-badge ${grammar.level === '初中' ? 'primary' : 'secondary'}`}>{grammar.level}</span>
                        </td>
                        <td>{grammar.total_questions > 0 ? grammar.total_questions : ''}</td>
                        <td>{grammar.sort_order}</td>
                        <td>{new Date(grammar.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="edit-button">编辑</button>
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteGrammarType(grammar.id)}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        </main>
      </div>
    </div>
  );
}

export default App;
