import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://atipzmuwbeakxccnfkbl.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aXB6bXV3YmVha3hjY25ma2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTg4OTMsImV4cCI6MjA3MTczNDg5M30.N8Ba8mJh6DYuimrJS8jIbm5V4FFNH4ZXVv63ysrJpOM"
export const supabase = createClient(supabaseUrl, supabaseKey)